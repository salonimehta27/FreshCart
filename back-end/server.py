from flask import (Flask, render_template, make_response,request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db, User, Customer, CustomerRep, Driver, OrderItem,Order, Product, Location
from flask_sqlalchemy import SQLAlchemy
import requests

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
import crud
import cart_f
import stripe
import json

app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

CORS(app,supports_credentials=True)
os.system("source secrets.sh")
api_key = os.environ['API_KEY']
stripe.api_key= os.environ['STRIPE_API_KEY']
google_api_key = os.environ['GOOGLE_API_KEY']



@app.route('/clear_session_cookie')
def clear_session_cookie():
    response = make_response('Session cookie cleared!')
    response.delete_cookie('session')
    return response

@app.route("/")
def index():
    return render_template("index.html")

######### LOGIN/SIGNUP/LOGOUT ###########

@app.route("/login", methods = ["POST"])
@cross_origin(supports_credentials=True)
def process_login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = crud.get_user_by_email(email)
 
    if user is not None:
        if user.password == password:
            session['user_id'] = user.customer.id
            print("process login", session["user_id"])
            cart_f.merge_guest_cart() # Merge the guest cart with the user's cart, if applicable
            return jsonify({"id":user.customer.id, 
                            "fname":user.fname,
                            "lname":user.lname,
                            "username":user.username,
                            "email":user.email,})
        else:
            return jsonify(success=False, error="Incorrect password"), 401
    else:
        return jsonify(success=False, error="User not found"), 401


@app.route("/me")
@cross_origin(supports_credentials=True)
def currentUser():
    if "user_id" in session:
        print("me",session["user_id"])
        user = crud.get_customer_by_id(session["user_id"])
        if user is not None:
           user= user.user
           return jsonify({"id":user.id, "fname":user.fname,
                           "lname":user.lname,
                           "username":user.username,
                           "email":user.email,
                           "customer_id":session["user_id"]})
    return jsonify({"error": "User not in session"})


@app.route("/signup", methods=["POST"])
def signup_route():
    # Get the form data
    print(request.json)
    fname = request.json.get("fname")
    lname = request.json.get("lname")
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    role = request.json.get("role")
    # Call the signup helper function
    result = crud.signup(
        fname,
        lname,
        username,
        email,
        password,
        role
    )
    if "error" in result:
        return jsonify({"error":result["error"]})
    else:
        user_id = result["user"].id
        if role == "customer":
            cart_f.create_cart(user_id)
        return jsonify({"success": True})

@app.route("/logout")
def process_logout():
    session.pop('user_id', None)
    return jsonify(success=True)

######### PRODUCTS ###########
@app.route("/products")
@cross_origin(supports_credentials=True)
def get_products():
    products = crud.get_all_products()
    products_dict = [product.to_dict() for product in products]
    return jsonify(products_dict)

@app.route("/products/<id>")
@cross_origin(supports_credentials=True)
def product_details(id):
    product = crud.get_product_details(id)
    product_dict = product.to_dict()
    return jsonify(product_dict)

######### CART ###########

@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    product_id = request.json.get("product_id")
    quantity = request.json.get("quantity")
    cart_f.add_product_to_cart(product_id, quantity)
    cart = cart_f.get_cur_cart()
    return jsonify(cart)


@app.route('/myCart')
def get_cart():
    print(session)
    if "user_id" in session:
        user_id = session["user_id"]
        cart = cart_f.get_cart_by_customer_id(user_id)
        if cart is not None:
             return jsonify(cart_f.create_cart_response(cart, cart.id))
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        guest_cart = cart_f.get_cart_by_id(guest_cart_id)
        if guest_cart is not None:
            return jsonify(cart_f.create_cart_response(guest_cart, guest_cart_id))
    return jsonify({"error": "Empty Cart"})

@app.route('/cart/<product_id>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def remove_from_cart(product_id):
    if "user_id" in session:
        user_id = session["user_id"]
        user_cart_id = cart_f.get_cart_by_customer_id(user_id).id
        cart_f.remove_product_from_cart(user_cart_id, product_id)
        return jsonify(success=True)
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        cart_f.remove_product_from_cart(guest_cart_id, product_id)
        return jsonify(success=True)
    return jsonify(error="Cart not found")


@app.route('/cart/<product_id>', methods=['PATCH'])
def update_cart_quantity(product_id):
  
    quantity = int(request.json.get("quantity"))
    if "user_id" in session:
        user_id = session["user_id"]
        cart = cart_f.get_cart_by_customer_id(user_id)
        cart_f.update_cart_product_quantity(cart.id, int(product_id), quantity)
        return jsonify(cart_f.create_cart_response(cart, cart.id))
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        cart_f.update_cart_product_quantity(guest_cart_id, int(product_id), quantity)
        cart = cart_f.get_cart_by_id(guest_cart_id)
        return jsonify(cart_f.create_cart_response(cart, guest_cart_id))
    return jsonify(error="Cart not found")

@app.route('/update_customer_info', methods=['POST'])
def update_customer_info():
    user_id = request.form.get("user_id")
    address = request.form.get("address")
    phone_number = request.form.get("phone_number")

    result = crud.update_customer_info(user_id, address=address, phone_number=phone_number)

    return jsonify(result)

@app.route('/submit_order', methods=['POST'])
def submit_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    order_items = data.get('order_items')

    total_price = sum(item['quantity'] * item['price'] for item in order_items)
    total_price = round(total_price, 2)

    new_order = Order(customer_id=customer_id, total=total_price)
    db.session.add(new_order)

    for item in order_items:
        order_item = OrderItem(order=new_order, product_id=item['product_id'], quantity=item['quantity'], price=item['price'])
        db.session.add(order_item)


    if customer_id:
        cart = cart_f.get_cart_by_customer_id(customer_id)
    if cart:
        cart.cart_products = []
        db.session.commit()

    # Return a JSON response indicating success
    return jsonify({'success': True})


# Route for updating driver info
@app.route('/update_driver_info', methods=['POST'])
def update_driver_info():
    user_id = request.form.get("user_id")
    car_model = request.form.get("car_model")
    license_plate = request.form.get("license_plate")

    result = crud.update_driver_info(user_id, car_model=car_model, license_plate=license_plate)

    return jsonify(result)
def calculate_order_amount(items):
    total = 0
    
    for cart_product in items["cart_products"]:
        for product in items['products']:
            if cart_product['product_id'] == product['id']:
                total += round(product['price'], 2) * cart_product['quantity']
                break
    
    return int(total * 100)

@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        
        data = json.loads(request.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data['items']),
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    
def get_stores():
    type = "department_store"
    query = "Walmart"
    location = "New York"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}+in+{location}&type={type}&key={google_api_key}"
    
    response = requests.get(url)
    data = response.json()
    walmartStores = data["results"]
    
    walmartLocations = [
        {
            "name": store["name"],
            "address": store["formatted_address"],
            "latitude": store["geometry"]["location"]["lat"],
            "longitude": store["geometry"]["location"]["lng"],
        }
        for store in walmartStores
    ]

    return walmartLocations

def find_nearest_driver(customer_id, customer_lat, customer_lng):
    customer_location = Location.query.filter_by(customer_id=customer_id).first()

    if not customer_location:
        return None

    drivers = Driver.query.all()
    nearest_driver = None
    shortest_distance = None

    for driver in drivers:
        driver_location = Location.query.filter_by(driver_id=driver.id).first()

        if not driver_location:
            continue

        distance_to_customer = crud.calculate_distance(
            customer_lat, customer_lng, driver_location.latitude, driver_location.longitude
        )

        if shortest_distance is None or distance_to_customer < shortest_distance:
            shortest_distance = distance_to_customer
            nearest_driver = driver

    return nearest_driver


def find_nearest_walmart(customer_lat, customer_lng):
    walmart_locations = get_stores()
    shortest_distance = None
    nearest_walmart = None

    for walmart in walmart_locations:
        distance_to_walmart = crud.calculate_distance(
            customer_lat, customer_lng, walmart["latitude"], walmart["longitude"]
        )

        if shortest_distance is None or distance_to_walmart < shortest_distance:
            shortest_distance = distance_to_walmart
            nearest_walmart = walmart

    return nearest_walmart

@app.route("/api/places", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_places():
    customer_id = request.json.get("customerId")
    lat = request.json.get("latitude")
    lng = request.json.get("longitude")

    existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()

    if existing_location:
        nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
        nearest_walmart_location = find_nearest_walmart(lat, lng)

        return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location
        }

    location = Location(customer_id=customer_id, latitude=lat, longitude=lng)
    db.session.add(location)
    db.session.commit()

    nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
    nearest_walmart_location = find_nearest_walmart(lat, lng)

    if not nearest_walmart_location:
        return {
            "error": "No Walmart locations found",
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": None
        }

    return {
        "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
        "walmart_location": nearest_walmart_location
    }
# def nearest_driver(customer_id, walmart_lat, walmart_lng):
#     customer_location = Location.query.filter_by(customer_id=customer_id).first()

#     if not customer_location:
#         return jsonify({'error': 'Customer location not found'}), 404

#     drivers = Driver.query.all()
#     nearest_driver = None
#     shortest_distance = None

#     for driver in drivers:
#         driver_location = Location.query.filter_by(driver_id=driver.id).first()

#         if not driver_location:
#             continue

#         # calculate distance between customer location and driver location
#         distance_to_customer = crud.calculate_distance(customer_location.latitude, customer_location.longitude, driver_location.latitude, driver_location.longitude)

#         # calculate distance between driver location and Walmart location
#         distance_to_walmart = crud.calculate_distance(driver_location.latitude, driver_location.longitude, walmart_lat, walmart_lng)

#         # calculate total distance
#         total_distance = distance_to_customer + distance_to_walmart

#         # check if this is the closest driver
#         if shortest_distance is None or total_distance < shortest_distance:
#             shortest_distance = total_distance
#             nearest_driver = driver

#     if not nearest_driver:
#         return jsonify({'error': 'No drivers found'}), 404

#     return jsonify(nearest_driver.to_dict())



# @app.route('/api/places', methods=["POST"])
# def get_places():
#     customer_id = request.json.get("customerId")
#     lat = request.json.get("latitude")
#     lng = request.json.get("longitude")
#     # Check if the customer already has a location with the same latitude and longitude
#     existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()

#     if existing_location:
#         return nearest_driver(customer_id, lat, lng)

#     # Create a new location
#     location = Location(customer_id=customer_id, latitude=lat, longitude=lng)
#     db.session.add(location)
#     db.session.commit()

#     # Get Walmart locations
#     walmart_locations = get_stores()

#     # Find the Walmart location that results in the shortest distance for the driver
#     shortest_distance = None
#     nearest_walmart = None

#     for walmart in walmart_locations:
#         distance_to_walmart = crud.calculate_distance(lat, lng, walmart["latitude"], walmart["longitude"])
#         if shortest_distance is None or distance_to_walmart < shortest_distance:
#             shortest_distance = distance_to_walmart
#             nearest_walmart = walmart

#     if not nearest_walmart:
#         return jsonify({'error': 'No Walmart locations found'}), 404

#     return {"driver":nearest_driver(customer_id, nearest_walmart["latitude"], nearest_walmart["longitude"]), "walmart_location": jsonify(nearest_walmart)}

# def nearest_driver(customer_id):
#     customer_location = Location.query.filter_by(customer_id=customer_id).first()

#     if not customer_location:
#         return jsonify({'error': 'Customer location not found'}), 404

#     drivers = Driver.query.all()
#     nearest_driver = None
#     shortest_distance = None

#     for driver in drivers:
#         driver_location = Location.query.filter_by(driver_id=driver.id).first()

#         if not driver_location:
#             continue

#         # calculate distance between customer location and driver location
#         distance = crud.calculate_distance(customer_location.latitude, customer_location.longitude, driver_location.latitude, driver_location.longitude)

#         # check if this is the closest driver
#         if shortest_distance is None or distance < shortest_distance:
#             shortest_distance = distance
#             nearest_driver = driver

#     if not nearest_driver:
#         return jsonify({'error': 'No drivers found'}), 404

#     return jsonify(nearest_driver.to_dict())

# @app.route('/api/places', methods=["POST"])
# def get_places():
#     customer_id = request.json.get("customerId")
#     lat = request.json.get("latitude")
#     lng = request.json.get("longitude")

#     # Check if the customer already has a location with the same latitude and longitude
#     existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()
    
#     if existing_location:
#         return nearest_driver(customer_id)
    
#     # Create a new location
#     location = Location(customer_id=customer_id, latitude=lat, longitude=lng)
#     db.session.add(location)
#     db.session.commit()

#     return nearest_driver(customer_id)


# @app.route('/nearest_driver', methods=['POST'])

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
