from flask import (Flask, render_template, make_response,request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db, User, Customer, CustomerRep, Driver, OrderItem,Order, Product, Location, Query, Chat, ChatMessage
from flask_sqlalchemy import SQLAlchemy
import requests
from datetime import datetime
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
import crud
import cart_f
import stripe
import json
from flask_socketio import SocketIO, emit
from flask_caching import Cache
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
app.app_context().push()
app.secret_key = "dev"
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
CORS(app,supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
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

def preprocess_input(user_input):
    tokens = word_tokenize(user_input.lower())
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words and token not in string.punctuation]
    return tokens

# Define responses
def get_response(user_input, is_connecting_to_representative):
    if 'hi' in user_input:
        return 'Hello! How can I assist you today?'
    elif 'bye' in user_input:
        return 'Goodbye!'
    elif 'product' in user_input:
        return 'Sure, I can help you with that. What specific product are you looking for?'
    elif 'order' in user_input or "help" in user_input:
        return 'To place an order, please provide your details and the product you want to purchase.'
    elif 'representative' in user_input or "human" in user_input or "speak to representative" in user_input and not is_connecting_to_representative:
        return 'I can connect you to a representative. Please wait a moment.'
    elif is_connecting_to_representative:
        # Perform necessary actions to handle representative communication
        return 'Connecting you to a representative...'
    else:
        return "I'm sorry, I didn't understand that."
# Connect to a representative
def connect_to_representative(query):
    # Perform necessary actions to connect the user to a representative
    print('Chatbot: You are now connected to a representative. How may I assist you further?')
    while True:
        user_input = input('User: ')
        # Handle user interaction with the representative
        # Additional code for representative interaction goes here
        if 'bye' in user_input:
            print('Chatbot: Goodbye! Have a great day.')
            break


# Chatbot route
@app.route("/api/chat/<customer_id>", methods=["POST"])
def chat(customer_id):
    user_input = request.json['user_input']
    is_connecting_to_representative = 'representative' in user_input
    preprocessed_input = preprocess_input(user_input)
    response = get_response(preprocessed_input, is_connecting_to_representative)
    
    #import pdb; pdb.set_trace()
    if 'representative' in user_input:
        # Include a flag to indicate if the response prompts connecting to a representative
        response_data = {
            'response': response,
            'connect_to_representative': True
        }
    else:
        response_data = {
            'response': response,
            'connect_to_representative': False
        }

    # Check if a chat already exists in the session
    if 'chat_messages' not in session:
        session['chat_messages'] = []
    
    # Add the new chat message and the chatbot response to the session
    session['chat_messages'].append(('User', user_input))
    session['chat_messages'].append(('Chatbot', response))

    # Check if the customer representative accepted the query
    if is_connecting_to_representative:
        # Create a new query and save the chat messages to the database
        query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
        db.session.add(query)
        db.session.commit()
    
        chat = Chat(customer_id=customer_id, query_id = query.id)
        db.session.add(chat)
        db.session.commit() 

        for i, message in enumerate(session["chat_messages"]):
            import pdb; pdb.set_trace()
            if message[i][0] == "User":
                chat_message = ChatMessage(message = message, chat_id = chat.id, customer_id=customer_id)
                db.session.add(chat_message)
                db.session.commit()
            elif message[i][0] == "Chatbot": 
                chat_message = ChatMessage(message = message, chat_id = chat.id)
                db.session.add(chat_message)
                db.session.commit()


        #connect_to_representative(query)

        # session['chat_messages'] = []
    else:
        # Add the chat messages from the session to the response data
        response_data['chat_messages'] = session['chat_messages']
    
    return jsonify(response_data)

@app.route("/queries")
def get_queries():
    active_queries = Query.query.filter_by(is_accepted = False)
    queries = []

    for query in active_queries:
        queries.append(query.to_dict())

    return jsonify(queries)

@app.route("/accept-query/<id>", methods = ["PATCH"])
def acceptQuery(id):
    is_accepted = request.json.get("is_accepted")
    
    query = Query.query.get(id)
    if (is_accepted == "true"):
        query.is_accepted = True
        db.session.add(query)
        db.session.commit()
    
    return jsonify(query.to_dict())




# @app.route("/api/chat/<customer_id>", methods=["POST"])
# def chat(customer_id):
#     user_input = request.json['user_input']
#     is_connecting_to_representative = 'representative' in user_input
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, is_connecting_to_representative)
    
#     #import pdb; pdb.set_trace()
#     if 'representative' in user_input:
#         # Include a flag to indicate if the response prompts connecting to a representative
#         response_data = {
#             'response': response,
#             'connect_to_representative': True
#         }
#     else:
#         response_data = {
#             'response': response,
#             'connect_to_representative': False
#         }

#     # Check if a chat already exists in the session
#     if 'chat_messages' not in session:
#         session['chat_messages'] = []
    
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append(('User', user_input))
#     session['chat_messages'].append(('Chatbot', response))

#     # Check if the customer representative accepted the query
#     if is_connecting_to_representative:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()

#         # Retrieve the existing chat messages
#         #chat_messages = Chat.query.filter_by(customer_id=customer_id, query=query).all()
#         # Add the existing chat messages to the response data
#         # response_data['chat_messages'] = [(chat.user_type, chat.message) for chat in chat_messages]

#         # Save the chat messages from the session to the database
#         for user_type, chat_message in session['chat_messages']:
#             chat = Chat(message=chat_message, customer_id=customer_id, customer_rep_id=query.customer_rep_id, query=query, user_type=user_type)
#             db.session.add(chat)
        
#         db.session.commit()

#         # Clear the chat messages from the session
#         session['chat_messages'] = []
#     else:
#         # Add the chat messages from the session to the response data
#         response_data['chat_messages'] = session['chat_messages']
    
#     return jsonify(response_data)
######### LOGIN/SIGNUP/LOGOUT ###########
@app.route("/admin-login", methods = ["POST"])
@cross_origin(supports_credentials=True)
def process_login_admin():
    email = request.json.get("email")
    password = request.json.get("password")

    user = crud.get_user_by_email(email)
    if user is not None:
        if user.password == password:
            session['customer_rep_id'] = user.customer_rep.id
            return jsonify({"id":user.customer_rep.id, 
                            "fname":user.fname,
                            "lname":user.lname,
                            "username":user.username,
                            "email":user.email,})
        else:
            return jsonify(success=False, error="Incorrect password"), 401
    else:
        return jsonify(success=False, error="User not found"), 401

@app.route("/admin-me")
@cross_origin(supports_credentials=True)
def current_customer_rep():
    if "customer_rep_id" in session:
        user = crud.get_customer_rep_by_id(session["customer_rep_id"])
        if user is not None:
           user= user.user
           return jsonify({"id":user.id, "fname":user.fname,
                           "lname":user.lname,
                           "username":user.username,
                           "email":user.email,
                           "customer_rep_id":session["customer_rep_id"]})
    return jsonify({"error": "User not in session"})


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

@app.route("/admin-logout")
def process_admin_logout():
    session.pop('customer_rep_id', None)
    return jsonify(success=True)

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

@cache.cached(timeout=86400) 
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


@socketio.on("driver-location-update")
def handle_driver_location_update(data):
    # print("data", data)
   
   
    driver_id = data['id']
    latitude = data["driverLocation"]['latitude']
    longitude = data["driverLocation"]['longitude']
    
    driver = Driver.query.get(driver_id)
    if driver:
        # Update the driver's location
        driver.location.latitude = latitude
        driver.location.longitude = longitude
        db.session.commit()
        
        driver_data = driver.to_dict()  # Convert the driver object to a dictionary using the to_dict() method (assuming you have defined it)
        emit('driver_location_update', driver_data, broadcast=True)  # Updated event name here
    else:
        pass


def find_nearest_driver(customer_id, customer_lat, customer_lng):
    #import pdb; pdb.set_trace()
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
@cache.cached(timeout=86400, query_string=True)  # Cache the response for 1 hour
def get_places():
    customer_id = request.json.get("customerId")
    lat = request.json.get("latitude")
    lng = request.json.get("longitude")

    existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()
    if existing_location:
        nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
        nearest_walmart_location = find_nearest_walmart(lat, lng)
        directions = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
        return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
            "directions":directions["directions"],
            "estimated_time":directions["estimated_time"]
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
    directions = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
    return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
            "directions":directions["directions"],
            "estimated_time":directions["estimated_time"]
        }



def get_directions(driver, walmart):
    driver_lat = driver["location"]["latitude"]
    driver_lng = driver["location"]["longitude"]
    walmart_lat = walmart["latitude"]
    walmart_lng = walmart["longitude"]

   
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={driver_lat},{driver_lng}&destination={walmart_lat},{walmart_lng}&key={google_api_key}"
    response = requests.get(url)
    data = response.json()

    if "routes" not in data or len(data["routes"]) == 0:
        return None

    route = data["routes"][0]
    legs = route["legs"]

    total_duration = sum([leg["duration"]["value"] for leg in legs])  # Sum of durations of all legs

    estimated_time = timedelta(seconds=total_duration)

    return {
        "estimated_time": str(estimated_time),
        "directions": data
    }



if __name__ == "__main__":
    connect_to_db(app)
    socketio.run(app, host="0.0.0.0", debug=True)