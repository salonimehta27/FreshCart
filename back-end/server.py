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
import model

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
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", manage_session=True)
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
    print("data", data)
    driver_id = data['id']
    latitude = data["driverLocation"]['latitude']
    longitude = data["driverLocation"]['longitude']
    
    driver = Driver.query.get(driver_id)
    #import pdb; pdb.set_trace()
    if driver:
        # Update the driver's location
       
        driver.location[0].latitude = latitude
        driver.location[0].longitude = longitude
        db.session.add(driver)
        db.session.commit()
       
        driver_data = driver.to_dict() 
        # import pdb; pdb.set_trace()
        emit('driver_location_updated', {
            "driver_data": driver_data,
        }, broadcast=True)
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
    latitude = request.json.get("latitude")
    longitude = request.json.get("longitude")
    customer = {
        "latitude": latitude,
        "longitude": longitude
    }
    existing_location = Location.query.filter_by(customer_id=customer_id, latitude=latitude, longitude=longitude).first()
    if existing_location:
        nearest_driver_info = find_nearest_driver(customer_id, latitude, longitude)
        nearest_walmart_location = find_nearest_walmart(latitude, longitude)
        return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
        }

    location = Location(customer_id=customer_id, latitude=latitude, longitude=longitude)
    db.session.add(location)
    db.session.commit()

    nearest_driver_info = find_nearest_driver(customer_id, latitude, longitude)
    nearest_walmart_location = find_nearest_walmart(latitude, longitude)
    
    if not nearest_walmart_location:
        return {
            "error": "No Walmart locations found",
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": None
        }
    return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
        }


def get_directions_to_customer(walmart, customer):
    walmart_lat = walmart["latitude"]
    walmart_lng = walmart["longitude"]
    customer_lat = customer["latitude"]
    customer_lng = customer["longitude"]

   
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={walmart_lat},{walmart_lng}&destination={customer_lat},{customer_lng}&key={google_api_key}"
    response = requests.get(url)
    data = response.json()

    if "routes" not in data or len(data["routes"]) == 0:
        return None

    route = data["routes"][0]
    legs = route["legs"]

    total_duration = sum([leg["duration"]["value"] for leg in legs])  # Sum of durations of all legs

    estimated_time = timedelta(seconds=total_duration)

    data["request"] = {
        "origin": {"latitude": walmart_lat, "longitude": walmart_lng},
        "destination": {"latitude": customer_lat, "longitude": customer_lng},
        "travelMode": "DRIVING"
    }

    return {
        "estimated_time": str(estimated_time),
        "directions": data
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

    data["request"] = {
        "origin": {"latitude": driver_lat, "longitude": driver_lng},
        "destination": {"latitude": walmart_lat, "longitude": walmart_lng},
        "travelMode": "DRIVING"
    }
    return {
        "estimated_time": str(estimated_time),
        "directions": data
    }
def preprocess_input(user_input):
    tokens = word_tokenize(user_input.lower())
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words and token not in string.punctuation]
    return tokens

# Define responses
def get_response(user_input):
    if 'hi' in user_input:
        return 'Hello! How can I assist you today?'
    elif 'bye' in user_input:
        return 'Goodbye!'
    elif 'product' in user_input:
        return 'Sure, I can help you with that. What specific product are you looking for?'
    elif 'cancel' in user_input:
        return "To assist you with the cancellation, would you like me to connect you with representative?"
    elif 'order' in user_input or "help" in user_input:
        return 'How can I assist you with the order?'
    else:
        return "I'm sorry, I am afraid I can't help you with that, would you like to speak to representative?"


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('user_message')
def handle_user_message(data):
    message = data['message']
    # Generate chatbot response
    preprocessed_input = preprocess_input(message)
    response = get_response(preprocessed_input)
    session.modified = True
    #import pdb; pdb.set_trace()
    emit('chatbot_response', {'sender': 'Chatbot', 'message': response})

#@socketio.on('accept_query')
@app.route("/post_query/<customer_id>", methods=["POST"])
def handle_accept_query(customer_id):
    message = request.json['user_input']
    if "representative" in message.lower() or "human" in message.lower() or "yes":
        query = Query(customer_id=customer_id, customer_rep_id=None, message=message, is_accepted=False)
        db.session.add(query)
        db.session.commit()
        chat = Chat(customer_id=customer_id, query_id=query.id)
        db.session.add(chat)
        db.session.commit()
        #import pdb; pdb.set_trace()
        if "chat_messages" in session:
            for message in session["chat_messages"]:
                if message['sender'] == 'User':
                    chat_message = ChatMessage(message=message['message'], chat_id=chat.id, customer_id=customer_id)
                    db.session.add(chat_message)
                elif message['sender'] == 'Chatbot':
                    chat_message = ChatMessage(message=message['message'], chat_id=chat.id)
                    db.session.add(chat_message)
            db.session.commit()
            session["chat_messages"] = []
            session["chat_id"] = chat.id
        messages = []
        chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

        for message in chat_messages:
            if message.customer_id is None and message.customer_rep_id is None:
                messages.append({'sender': 'Chatbot', 'message': message.message})
            elif message.customer_id:
                messages.append({'sender': 'User', 'message': message.message})
            elif message.customer_rep_id:
                messages.append({'sender': 'Customer_rep', 'message': message.message})
        response = {"sender":"Chatbot", "message":"I can connect you to a representative. Please wait a moment and don't refresh the page"}
        socketio.emit("customer query", {"query" : query.to_dict()})
        return jsonify({"chatId" : chat.id, "message": response})

@app.route("/api/chat/<customer_id>", methods=["POST"])
def chat(customer_id):
    message = request.json['user_input']
    # Generate chatbot response
    preprocessed_input = preprocess_input(message)
    response = get_response(preprocessed_input)
    if 'chat_messages' not in session:
        session['chat_messages'] = []
    session['chat_messages'].append({'sender': 'User', 'message': message})
    session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
    session.modified = True

    return jsonify(session["chat_messages"])

@socketio.on("customer_rep_message")
def handle_customer_rep_message(data):
                # Handle the message received from the customer representative
    message = data.get("message")
    chat_id = data.get("chat_id")

                # Perform any necessary operations with the message (e.g., save to the database)
    customer_rep_id = data.get("customer_rep_id")
    customer_rep_message = ChatMessage(message=message, chat_id=chat_id, customer_rep_id=customer_rep_id)
    db.session.add(customer_rep_message)
    db.session.commit()

                # Emit the message to the appropriate chat
    emit("customer_rep_response", {"sender": "Customer_rep", "message": message, "roomId": chat_id}, broadcast = True)

@socketio.on("customer_response")
def handle_customer_response(data):
    sender = "User"
    message = data["message"]
    roomId = data["roomId"]
    customer_id = data["customerId"]

    chat_message = ChatMessage(message=message, chat_id=roomId, customer_id = customer_id)
    db.session.add(chat_message)
    db.session.commit()
    emit("customer_resp", {"sender": sender, "message": message, "roomId": roomId}, broadcast = True)


@socketio.on("connect_customer_rep")
def handle_connect_customer_rep():
    # Handle the connection of a customer representative
    # You can perform any necessary operations here
    print("Customer representative connected")


@app.route("/get_chat")
@cross_origin(supports_credentials=True)
def get_chat():
    if 'chat_messages' in session and 'chat_id' not in session:
        # If there are chat messages in the session and chat_id doesn't exist
        
        # Retrieve all session chat messages
        messages = session['chat_messages']
    elif 'chat_id' in session:
        # If chat_id exists in the session
        
        # Retrieve chat messages from the chat with the specified chat_id
        chat_id = session['chat_id']
        chat = Chat.query.get(chat_id)
        if chat:
            chat_messages = ChatMessage.query.filter_by(chat_id = chat.id).all()
            messages = []
            for message in chat_messages:
                if message.customer_id is None and message.customer_rep_id is None:
                    messages.append({'sender': 'Chatbot', 'message': message.message})
                elif message.customer_id:
                    messages.append({'sender': 'User', 'message': message.message})
                elif message.customer_rep_id:
                    messages.append({'sender': 'Customer_rep', 'message': message.message})
        else:
            # Chat not found
            messages = []
    else:
        # No chat messages found
        messages = []
    chat_id = session.get("chat_id", None)
    return jsonify({"messages": messages, "chatId": chat_id})


def get_chat_messages(query_id):
    # Find the chat associated with the query ID
    # import pdb; pdb.set_trace()
    chat = Chat.query.filter_by(query_id=int(query_id)).first()

    if not chat:
        return jsonify({'error': 'Chat not found'})

    # Retrieve all chat messages for the given chat
    chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

    # Prepare the response data
    messages = []
    for message in chat_messages:
                if message.customer_id is None and message.customer_rep_id is None:
                    messages.append({'sender': 'Chatbot', 'message': message.message})
                elif message.customer_id:
                    messages.append({'sender': 'User', 'message': message.message})
                elif message.customer_rep_id:
                    messages.append({'sender': 'Customer_rep', 'message': message.message})

    return messages

#Chatbot route

@app.route("/queries")
def get_queries():
    active_queries = Query.query.filter_by(is_accepted = False)
    queries = []

    for query in active_queries:
        queries.append(query.to_dict())

    return jsonify(queries)

@app.route("/accept-query/<id>", methods=["PATCH"])
def accept_query(id):
    is_accepted = request.json.get("is_accepted")
    customer_rep_id = request.json.get("customer_rep_id")
    query_obj= Query.query.get(id)
    #import pdb; pdb.set_trace()
    chat = Chat.query.filter_by(query_id=query_obj.id).first()
    messages = get_chat_messages(query_obj.id)
    if is_accepted:
       # import pdb; pdb.set_trace()
        query_obj.is_accepted = True
        db.session.add(query_obj)
        db.session.commit()
        
        # Assign a customer representative ID to the query
        # Implement your logic to generate a unique ID for the customer representative
        query_obj.customer_rep_id = customer_rep_id
        db.session.add(query_obj)
        db.session.commit()
        socketio.emit("customer_rep_message", {"sender": "Customer_rep", "message": f"connected to the representative, How can I assist you?"}, room=chat.id)
     #socketio.emit("customer_rep_message", {"sender": "Customer_rep", "message": f"connected to the representative {query.customer_rep_id.user.name}"}, room=query.chat_id)
    return jsonify({"query" :query_obj.to_dict(), "messages":messages, "chat_id":chat.id})



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
            session.modified = True
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
    #import pdb; pdb.set_trace()
    if "customer_rep_id" in session:
        user = CustomerRep.query.get(session["customer_rep_id"])
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
            # import pdb; pdb.set_trace()
            session['chat_messages'] = []
            print("process login", session["user_id"])
            cart_f.merge_guest_cart() # Merge the guest cart with the user's cart, if applicable
            return jsonify({"id":user.id,
                            "customer_id":user.customer.id,
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
    session.pop("chat_messages", None)
    session.pop("chat_id", None)
    
    return jsonify(success=True)


@app.route("/users/<id>", methods=["PATCH"])
def update_customer(id):
    user = User.query.get(id)
    if not user:
        return jsonify(message="User not found"), 404
    
    if 'username' in request.json:
        user.username = request.json['username']
    
    if 'password' in request.json and 'password_confirmation' in request.json:
        password = request.json['password']
        password_confirmation = request.json['password_confirmation']
        if password == password_confirmation:
            user.password = password
    
    db.session.commit()
    
    return jsonify({"id":user.id, "fname":user.fname,
                           "lname":user.lname,
                           "username":user.username,
                           "email":user.email,
                           "customer_id":user.customer.id}), 200


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

#### SUBMIT ORDER ######

@app.route('/submit_order', methods=['POST'])
def submit_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    order_items = data.get('order_items')

    total_price = sum(item['quantity'] * item['price'] for item in order_items)
    total_price = round(total_price, 2)
   
    new_order = Order(customer_id=customer_id, total=total_price)
    db.session.add(new_order)
    db.session.commit()
    # import pdb; pdb.set_trace()
    for item in order_items:
        order_item = OrderItem(order=new_order, product_id=item['product_id'], quantity=item['quantity'], price=item['price'])
        db.session.add(order_item)
        db.session.commit()

  

    if customer_id:
        cart = cart_f.get_cart_by_customer_id(customer_id)
    if cart:
        cart.cart_products = []
        db.session.commit()

    
    # Return a JSON response indicating success
    return jsonify({"order": new_order.to_dict()})


@app.route("/customer/orders", methods=['GET'])
def get_customer_orders():

    if ("user_id" in session):

        customer = Customer.query.get(session["user_id"])
        customer_id = session["user_id"]
        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        orders = Order.query.filter_by(customer_id=customer_id).order_by(Order.created_at.desc()).all()
        order_list = [order.to_dict() for order in orders]

        return jsonify({"orders": order_list})
    return jsonify({"error":"user not logged in"})


@app.route("/update-order-status", methods=['POST'])
def update_order_status():
    order_id = request.json.get("order_id")
    driver_id = request.json.get("driver_id")
    address = request.json.get("address")

    order = Order.query.get(order_id)
    order.driver_id = driver_id
    order.address = json.dumps(address)
    order.order_status = "DELIVERED"
    db.session.commit() 

    return jsonify({"order": order.to_dict()})


    
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

###### STRIPE PAYMENT #########
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





if __name__ == "__main__":
    connect_to_db(app)
    socketio.run(app, host="0.0.0.0", debug=True)