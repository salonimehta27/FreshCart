from flask import (Flask, render_template, make_response,request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db, User, Customer, CustomerRep, Driver
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
import crud
import cart_f

app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"

app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

CORS(app,supports_credentials=True)
os.system("source secrets.sh")
api_key = os.environ['API_KEY']



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
        user = crud.get_customer_by_id(session["user_id"]).user
        if user is not None:
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
            cart_dict = cart.to_dict()
            products = cart_f.get_products_in_cart(cart.id)
            product_dicts = [product.to_dict() for product in products]
            cart_dict['products'] = product_dicts
            return jsonify(cart_dict)
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        guest_cart = cart_f.get_cart_by_id(guest_cart_id)
        if guest_cart is not None:
            cart_dict = guest_cart.to_dict()
            products = cart_f.get_products_in_cart(guest_cart.id)
            product_dicts = [product.to_dict() for product in products]
            cart_dict['products'] = product_dicts
            return jsonify(cart_dict)
    return jsonify({"error": "Empty Cart"})

@app.route('/cart/<product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    if "user_id" in session:
        user_id = session["user_id"]
        cart_f.remove_product_from_cart(user_id, product_id)
        return jsonify(success=True)
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        cart_f.remove_product_from_cart(guest_cart_id, product_id)
        return jsonify(success=True)
    return jsonify(error="Cart not found")


@app.route('/cart/<product_id>', methods=['PATCH'])
def update_cart_quantity(product_id):
    quantity = request.json.get("quantity")
    if "user_id" in session:
        user_id = session["user_id"]
        cart_f.update_cart_product_quantity(user_id, product_id, quantity)
        cart = cart_f.get_cart_by_customer_id(user_id)
        cart_dict = cart.to_dict()
        products = cart_f.get_products_in_cart(cart.id)
        product_dicts = [product.to_dict() for product in products]
        cart_dict['products'] = product_dicts
        return jsonify(cart_dict)
    elif "guest_cart_id" in session:
        guest_cart_id = session["guest_cart_id"]
        cart_f.update_cart_product_quantity(guest_cart_id, product_id, quantity)
        cart = cart_f.get_cart_by_id(guest_cart_id)
        cart_dict = cart.to_dict()
        products = cart_f.get_products_in_cart(guest_cart_id)
        product_dicts = [product.to_dict() for product in products]
        cart_dict['products'] = product_dicts
        return jsonify(cart_dict)
    return jsonify(error="Cart not found")

@app.route('/update_customer_info', methods=['POST'])
def update_customer_info():
    user_id = request.form.get("user_id")
    address = request.form.get("address")
    phone_number = request.form.get("phone_number")

    result = crud.update_customer_info(user_id, address=address, phone_number=phone_number)

    return jsonify(result)


# Route for updating driver info
@app.route('/update_driver_info', methods=['POST'])
def update_driver_info():
    user_id = request.form.get("user_id")
    car_model = request.form.get("car_model")
    license_plate = request.form.get("license_plate")

    result = crud.update_driver_info(user_id, car_model=car_model, license_plate=license_plate)

    return jsonify(result)


@app.route('/nearest_driver', methods=['POST'])
def nearest_driver():
    customer_id = request.json['customer_id']
    customer_location = Location.query.filter_by(customer_id=customer_id).first()

    if not customer_location:
        return jsonify({'error': 'Customer location not found'}), 404

    drivers = Driver.query.all()
    nearest_driver = None
    shortest_distance = None

    for driver in drivers:
        driver_location = Location.query.filter_by(driver_id=driver.id).first()

        if not driver_location:
            continue

        # calculate distance between customer location and driver location
        distance = crud.calculate_distance(customer_location.latitude, customer_location.longitude, driver_location.latitude, driver_location.longitude)

        # check if this is the closest driver
        if shortest_distance is None or distance < shortest_distance:
            shortest_distance = distance
            nearest_driver = driver

    if not nearest_driver:
        return jsonify({'error': 'No drivers found'}), 404

    return jsonify

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
