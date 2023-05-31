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

    directions = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
    existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()
    if existing_location:
        nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
        nearest_walmart_location = find_nearest_walmart(lat, lng)

        return {
            "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
            "walmart_location": nearest_walmart_location,
            "directions":get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
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
        "walmart_location": nearest_walmart_location,
        "directions":directions["directions"],
        "estimated_time": directions["estimated_time"]
    }

def calculate_distance(lat1, lon1, lat2, lon2):
    # approximate radius of earth in km
    R = 6373.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance


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

    estimated_time = datetime.timedelta(seconds=total_duration)

    return {
        "estimated_time": str(estimated_time),
        "directions": data
    }


# @app.route("/update_driver_location", methods=["PATCH"])
# def updateDriver():
#     driver_id = request.json.get("id")
#     driver_location = request.json.get("driverLocation")

#     driver = Driver.query.get(driver_id).first()

#     driver.location.latitude = driver_location["latitude"]
#     driver.location.longtitude = driver_location["longitude"]

#     db.session.add(driver)
#     db.session.commit()

#     return driver.to_dict()


# def get_stores():
#     stores = Store.query.all()

#     walmartLocations = [
#         {
#             "name": store.name,
#             "address": store.address,
#             "latitude": store.latitude,
#             "longitude": store.longitude,
#         }
#         for store in stores
#     ]

#     return walmartLocations


# class Store(db.Model):
#     __tablename__ = 'stores'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String)
#     address = db.Column(db.Text)
#     latitude = db.Column(db.Float)
#     longitude = db.Column(db.Float)

#     def __init__(self, name, address, latitude, longitude):
#         self.name = name
#         self.address = address
#         self.latitude = latitude
#         self.longitude = longitude


# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     is_connecting_to_representative = 'representative' in user_input
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, is_connecting_to_representative)
    
    
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
    
#     #print(session)
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append(('User', user_input))
#     session['chat_messages'].append(('Chatbot', response))
#     session.modified = True

#     #import pdb; pdb.set_trace()
#     # Check if the customer representative accepted the query
#     if is_connecting_to_representative:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()
    
#         chat = Chat(customer_id=customer_id, query_id = query.id)
#         db.session.add(chat)
#         db.session.commit() 

#         session["chat_id"] = chat.id
#         for message in session["chat_messages"]:
#             if message[0] == "User":
#                 chat_message = ChatMessage(message = message, chat_id = chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#                 db.session.commit()
#             elif message[0] == "Chatbot": 
#                 chat_message = ChatMessage(message = message, chat_id = chat.id)
#                 db.session.add(chat_message)
#                 db.session.commit()

#         #connect_to_representative(query)
#         session['chat_messages'] = []
#         messages = []
#         chat_messages = ChatMessage.query.filter_by(chat_id = chat.id).all()

#         for message in chat_messages:
#             message = message.to_dict()
#             if message["customer_id"] == None and message["customer_rep_id"] == None:
#                 messages.append(("Chatbot", message["message"]))
#             elif message["customer_id"]:
#                 messages.append(("User", message["message"]))
#             elif message["customer_rep_id"]:
#                 messages.append(("Customer_rep", message))

#         response_data['chat_messages'] = messages
#     else:
#         # Add the chat messages from the session to the response data
#         response_data['chat_messages'] = session['chat_messages']
    
#     return jsonify(response_data)

# @app.route("/get_chat")
# @cross_origin(supports_credentials=True)
# def get_chat():
#     if 'chat_messages' in session and 'chat_id' not in session:
#         # If there are chat messages in the session and chat_id doesn't exist
        
#         # Retrieve all session chat messages
#         messages = session['chat_messages']
#     elif 'chat_id' in session:
#         # If chat_id exists in the session
        
#         # Retrieve chat messages from the chat with the specified chat_id
#         chat_id = session['chat_id']
#         chat = Chat.query.get(chat_id)
#         if chat:
#             chat_messages = chat.chat_messages.all()
#             messages = []
#             for message in chat_messages:
#                 if message.customer_id is None and message.customer_rep_id is None:
#                     messages.append(("Chatbot", message.message))
#                 elif message.customer_id:
#                     messages.append(("User", message.message))
#                 elif message.customer_rep_id:
#                     messages.append(("Customer_rep", message.message))
#         else:
#             # Chat not found
#             messages = []
#     else:
#         # No chat messages found
#         messages = []

#     return jsonify(messages)


# Connect to a representative
# def connect_to_representative(user_input):
#     # Perform necessary actions to connect the user to a representative
#     print('Chatbot: You are now connected to a representative. How may I assist you further?')
#     while True:
#         user_input = input('User: ')
#         # Handle user interaction with the representative
#         # Additional code for representative interaction goes here
#         if 'bye' in user_input:
#             print('Chatbot: Goodbye! Have a great day.')
#             break

# def connect_to_representative():
#     # Perform necessary actions to connect the user to a representative
#     print('Chatbot: You are now connected to a representative. How may I assist you further?')
#     emit('message', {'sender': 'Chatbot', 'message': 'You are now connected to a representative. How may I assist you further?'}, broadcast=True)
    
#     while True:
#         # Wait for the representative's message
#         @socketio.on('message')
#         def handle_rep_message(data):
#             global is_connected_to_rep
#             sender = data.get('sender')
#             message = data.get('message')

#             if is_connected_to_rep and sender == 'Customer_rep':
#                 # Handle the representative's message
#                 # print(f'{sender}: {message}')
#                 # Additional code to process the representative's message and generate a response if needed
#                 # You can emit the response as a 'message' event to the representative

#                 if 'bye' in message:
#                     is_connected_to_rep = False
#                     emit('message', {'sender': 'Chatbot', 'message': 'Chat ended.'}, broadcast=True)
#                     break


# @socketio.on('message')
# def handle_message(data):
#     sender = data.get('sender')
#     message = data.get('message')

#     # Handle the received message
#     print(f'{sender}: {message}')

#     # Example response from the representative
#     if sender == 'User' and 'representative' in message:
#         response = 'You are now connected to a representative. How may I assist you further?'
#         emit('message', {'sender': 'Chatbot', 'message': response}, broadcast=True)
#         # Additional code to notify the representative about the connection
#         # and establish a unique identifier for the conversation


# @app.route("/get_chat_messages/<query_id>")
# def get_chat_messages(query_id):
#     # Find the chat associated with the query ID
#     chat = Chat.query.filter_by(query_id=query_id).first()

#     if not chat:
#         return jsonify({'error': 'Chat not found'})

#     # Retrieve all chat messages for the given chat
#     chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

#     # Prepare the response data
#     messages = []
#     for message in chat_messages:
#             message = message.to_dict()
#             if message["customer_id"] == None and message["customer_rep_id"] == None:
#                 messages.append(("Chatbot", message["message"]))
#             elif message["customer_id"]:
#                 messages.append(("User", message["message"]))
#             elif message["customer_rep_id"]:
#                 messages.append(("Customer_rep", message))

#     return jsonify(messages)

# @app.route("/get_chat_messages/<query_id>")
# @cross_origin(supports_credentials=True)

# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, False)

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

#     is_connecting_to_representative = 'representative' in user_input
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append({'sender': 'User', 'message': user_input})
#     session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
#     session.modified = True

#     # Check if the customer representative accepted the query
#     if is_connecting_to_representative:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()

#         chat = Chat(customer_id=customer_id, query_id=query.id)
#         db.session.add(chat)
#         db.session.commit()

#         session["chat_id"] = chat.id
#         session.modified = True
#         for message in session["chat_messages"]:
#             if message['sender'] == 'User':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#                 db.session.commit()
#             elif message['sender'] == 'Chatbot':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id)

#                 # if is_accepted:
#                 #     chat_message.customer_rep_id = customer_rep.id
#                 db.session.add(chat_message)
#                 db.session.commit()

#         session['chat_messages'] = []
#         session.modified = True
#         messages = []
#         chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

#         for message in chat_messages:
#             if message.customer_id is None and message.customer_rep_id is None:
#                 messages.append({'sender': 'Chatbot', 'message': message.message})
#             elif message.customer_id:
#                 messages.append({'sender': 'User', 'message': message.message})
#             elif message.customer_rep_id:
#                 messages.append({'sender': 'Customer_rep', 'message': message.message})

#         response_data['chat_messages'] = messages
#     else:
#         # Add the chat messages from the session to the response data
#         session_messages = session.get('chat_messages', [])
#         response_data['chat_messages'] = session_messages

#     if query.customer_rep_id is not None:
#         # If a representative is assigned, omit the bot response from the response data
#         response_data.pop('response', None)

#     return jsonify(response_data)

# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, False)

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
#        session['chat_messages'] = []
#     session['chat_messages'].append({'sender': 'User', 'message': user_input})
#     session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
#     session.modified = True
#     if 'chat_id' not in session:
#         session['chat_id'] = None

#     chat_id = session['chat_id']
#     if chat_id is None:
#         # First time user or user reached the route without an active chat
#         response_data['chat_messages'] = session.get('chat_messages', [])
#         session['chat_messages'] = []  # Clear chat messages in session
#     else:
#         # Chat exists, retrieve messages from the database
#         chat = Chat.query.get(chat_id)
#         if chat is not None:
#             messages = []
#             chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()
#             for message in chat_messages:
#                 if message.customer_id is None and message.customer_rep_id is None:
#                     messages.append({'sender': 'Chatbot', 'message': message.message})
#                 elif message.customer_id:
#                     messages.append({'sender': 'User', 'message': message.message})
#                 elif message.customer_rep_id:
#                     messages.append({'sender': 'Customer_rep', 'message': message.message})
#             response_data['chat_messages'] = messages

#     is_connecting_to_representative = 'representative' in user_input
#     if is_connecting_to_representative and chat_id is None:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()

#         chat = Chat(customer_id=customer_id, query_id=query.id)
#         db.session.add(chat)
#         db.session.commit()

#         session['chat_id'] = chat.id
#         session.modified = True

#         # Add user message to the chat
#         chat_message = ChatMessage(message=user_input, chat_id=chat.id, customer_id=customer_id)
#         db.session.add(chat_message)
#         db.session.commit()

#         # Add bot response to the chat
#         bot_response = get_response(preprocess_input(user_input), True)
#         bot_message = ChatMessage(message=bot_response, chat_id=chat.id)
#         db.session.add(bot_message)
#         db.session.commit()

#         # Append bot response to the response_data
#         response_data['chat_messages'].append({'sender': 'Chatbot', 'message': bot_response})

#     chat_id = session.get("chat_id", None)
#     if chat_id and is_connecting_to_representative:
#         get_chat = Chat.query.get(chat_id)
#         get_query = Query.query.get(get_chat.query_id)
#         if get_query.customer_rep_id:
#             @socketio.on("customer_rep_message")
#             def handle_customer_rep_message(data):
#                 # Handle the message received from the customer representative
#                 message = data.get("message")
#                 chat_id = data.get("chat_id")
#                 customer_rep_id = data.get("customer_rep_id")
#                 customer_rep_message = ChatMessage(message=message, chat_id=chat.id, customer_rep_id=customer_rep_id)
#                 db.session.add(customer_rep_message)
#                 db.session.commit()

#                 # Perform any necessary operations with the message (e.g., save to the database)
#                 # Emit the message to the appropriate chat
#                 emit("chat_message", {"sender": "Customer_rep", "message": message}, room=chat_id)

#     chat_id = session.get("chat_id", None)
#     if chat_id:
#         get_chat = Chat.query.get(chat_id)
#         get_query = Query.query.get(get_chat.query_id)
#         if get_query.customer_rep_id:
#             # If a representative is assigned, omit the bot response from the response data
#             response_data.pop('response', None)

#     response_data['chat_messages'] = session["chat_messages"]
#     return jsonify(response_data)


# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, False)

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

#     is_connecting_to_representative = 'representative' in user_input
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append({'sender': 'User', 'message': user_input})
#     session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
#     session.modified = True

#     # Get the existing chat based on the session chat_id
#     chat_id = session.get("chat_id")
#     if chat_id is not None:
#         chat = Chat.query.get(chat_id)
#         if chat is not None:
#             # Add the user message to the existing chat
#             chat_message = ChatMessage(message=user_input, chat_id=chat.id, customer_id=customer_id)
#             db.session.add(chat_message)
#             db.session.commit()

#             # Generate bot response
#             preprocessed_message = preprocess_input(user_input)
#             bot_response = get_response(preprocessed_message, True)

#             # Add the bot response to the chat
#             bot_message = ChatMessage(message=bot_response, chat_id=chat.id)
#             db.session.add(bot_message)
#             db.session.commit()

#             # Append the bot response to the response_data
#             response_data['chat_messages'].append({'sender': 'Chatbot', 'message': bot_response})

#             if 'customer_rep_id' in get_chat:
#                 @socketio.on("customer_rep_message")
#                 def handle_customer_rep_message(data):
#                     # Handle the message received from the customer representative
#                     message = data.get("message")
#                     chat_id = data.get("chat_id")
#                     customer_rep_id = data.get("customer_rep_id")
#                     customer_rep_message = ChatMessage(message=message, chat_id=chat.id, customer_rep_id = customer_rep_id)
#                     db.session.add(customer_rep_message)
#                     db.session.commit()
#                     # Perform any necessary operations with the message (e.g., save to the database)
#                     # Emit the message to the appropriate chat
#                     emit("chat_message", {"sender": "Customer_rep", "message": message}, room=chat_id)

#     chat_id = session.get("chat_id", None)
#     if chat_id:
#         get_chat = Chat.query.get(chat_id)
#         get_query = Query.query.get(get_chat.query_id)
#         if get_query.customer_rep_id:
#             # If a representative is assigned, omit the bot response from the response data
#             response_data.pop('response', None)

#     response_data['chat_messages'] = session["chat_messages"]
#     return jsonify(response_data)


# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, False)

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

#     is_connecting_to_representative = 'representative' in user_input
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append({'sender': 'User', 'message': user_input})
#     session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
#     session.modified = True

#     # Check if the customer representative accepted the query
#     if is_connecting_to_representative:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()

#         chat = Chat(customer_id=customer_id, query_id=query.id)
#         db.session.add(chat)
#         db.session.commit()

#         session["chat_id"] = chat.id
#         session.modified = True
#         for message in session["chat_messages"]:
#             if message['sender'] == 'User':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#                 db.session.commit()
#             elif message['sender'] == 'Chatbot':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id)
#                 db.session.add(chat_message)
#                 db.session.commit()

#         session['chat_messages'] = []
#         session.modified = True
#         messages = []
#         chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

#         for message in chat_messages:
#             if message.customer_id is None and message.customer_rep_id is None:
#                 messages.append({'sender': 'Chatbot', 'message': message.message})
#             elif message.customer_id:
#                 messages.append({'sender': 'User', 'message': message.message})
#             elif message.customer_rep_id:
#                 messages.append({'sender': 'Customer_rep', 'message': message.message})

#         response_data['chat_messages'] = messages
#     else:
#         # Get the existing chat based on the session chat_id
#         chat_id = session.get("chat_id")
#         if chat_id is not None:
#             chat = Chat.query.get(chat_id)
#             if chat is not None:
#                 # Add the user message to the existing chat
#                 chat_message = ChatMessage(message=user_input, chat_id=chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#                 db.session.commit()

#                 # Generate bot response
#                 preprocessed_message = preprocess_input(user_input)
#                 bot_response = get_response(preprocessed_message, True)

#                 # Add the bot response to the chat
#                 bot_message = ChatMessage(message=bot_response, chat_id=chat.id)
#                 db.session.add(bot_message)
#                 db.session.commit()

#                 # Append the bot response to the response_data
#                 response_data['chat_messages'].append({'sender': 'Chatbot', 'message': bot_response})

#     chat_id = session.get("chat_id", None)
#     if chat_id:
#         get_chat = Chat.query.get(chat_id)
#         get_query = Query.query.get(get_chat.query_id)
#         if get_query.customer_rep_id:

#             @socketio.on("customer_rep_message")
#             def handle_customer_rep_message(data):
#             # Handle the message received from the customer representative
#                 message = data.get("message")
#                 chat_id = data.get("chat_id")

#             # Perform any necessary operations with the message (e.g., save to the database)
#                 customer_rep_id = data.get("customer_rep_id")
#                 customer_rep_message = ChatMessage(message=message, chat_id=chat.id, customer_rep_id=customer_rep_id)
#                 db.session.add(customer_rep_message)
#                 db.session.commit()
#             # Emit the message to the appropriate chat
#                 emit("chat_message", {"sender": "Customer_rep", "message": message}, room=chat_id)
#                 response_data.pop('response', None)
#             return jsonify(response_data)
#             # If a representative is assigned, omit the bot response from the response data
#     else:
#         response_data['chat_messages'] = session["chat_messages"]
#         return jsonify(response_data)

        # Add the chat messages



# @app.route("/api/chat/<customer_id>", methods=["POST"])
# @cross_origin(supports_credentials=True)
# def chat(customer_id):
#     user_input = request.json['user_input']
#     preprocessed_input = preprocess_input(user_input)
#     response = get_response(preprocessed_input, False)

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

#     is_connecting_to_representative = 'representative' in user_input
#     # Add the new chat message and the chatbot response to the session
#     session['chat_messages'].append({'sender': 'User', 'message': user_input})
#     session['chat_messages'].append({'sender': 'Chatbot', 'message': response})
#     session.modified = True
#     response_data['chat_messages'] = []
#     # Check if the customer representative accepted the query
#     if is_connecting_to_representative:
#         # Create a new query and save the chat messages to the database
#         query = Query(customer_id=customer_id, customer_rep_id=None, message=user_input, is_accepted=False)
#         db.session.add(query)
#         db.session.commit()

#         chat = Chat(customer_id=customer_id, query_id=query.id)
#         db.session.add(chat)
#         db.session.commit()

#         session["chat_id"] = chat.id
#         response_data["chat_id"] = chat.id
#         session.modified = True
#         for message in session["chat_messages"]:
#             if message['sender'] == 'User':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#             elif message['sender'] == 'Chatbot':
#                 chat_message = ChatMessage(message=message['message'], chat_id=chat.id)
#                 db.session.add(chat_message)
#         db.session.commit()

#         session['chat_messages'] = []
#         session.modified = True
#         messages = []
#         chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()

#         for message in chat_messages:
#             if message.customer_id is None and message.customer_rep_id is None:
#                 messages.append({'sender': 'Chatbot', 'message': message.message})
#             elif message.customer_id:
#                 messages.append({'sender': 'User', 'message': message.message})
#             elif message.customer_rep_id:
#                 messages.append({'sender': 'Customer_rep', 'message': message.message})

#         response_data['chat_messages'] = messages
#     else:
#         # Get the existing chat based on the session chat_id
#         chat_id = session.get("chat_id")
#         if chat_id is not None:
#             chat = Chat.query.get(chat_id)
#             if chat is not None:
#                 # Add the user message to the existing chat
#                 chat_message = ChatMessage(message=user_input, chat_id=chat.id, customer_id=customer_id)
#                 db.session.add(chat_message)
#                 db.session.commit()
#                 chat_messages = ChatMessage.query.filter_by(chat_id=chat.id).all()
#                 messages = []
#                 for message in chat_messages:
#                     if message.customer_id is None and message.customer_rep_id is None:
#                         messages.append({'sender': 'Chatbot', 'message': message.message})
#                     elif message.customer_id:
#                         messages.append({'sender': 'User', 'message': message.message})
#                     elif message.customer_rep_id:
#                         messages.append({'sender': 'Customer_rep', 'message': message.message})

#                 response_data['chat_messages'] = messages
#                 # Generate bot response
#                 preprocessed_message = preprocess_input(user_input)
#                 bot_response = get_response(preprocessed_message, True)

#                 # Add the bot response to the chat
#                 bot_message = ChatMessage(message=bot_response, chat_id=chat.id)
#                 db.session.add(bot_message)
#                 db.session.commit()

#                 response_data['chat_messages'].append({'sender': 'Chatbot', 'message': bot_response})

#     chat_id = session.get("chat_id", None)
#     if chat_id:
#         get_chat = Chat.query.get(chat_id)
#         get_query = Query.query.get(get_chat.query_id)
#         if get_query.customer_rep_id:
#             response_data.pop('response', None)
#     else:
#         response_data['chat_messages'] = session["chat_messages"]

#     return jsonify(response_data)

# @app.route("/api/places", methods=["POST"])
# @cross_origin(supports_credentials=True)
# @cache.cached(timeout=86400, query_string=True)  # Cache the response for 1 hour
# def get_places():
#     customer_id = request.json.get("customerId")
#     lat = request.json.get("latitude")
#     lng = request.json.get("longitude")

#     existing_location = Location.query.filter_by(customer_id=customer_id, latitude=lat, longitude=lng).first()
#     if existing_location:
#         nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
#         nearest_walmart_location = find_nearest_walmart(lat, lng)
#         directions_to_walmart = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)

#         if nearest_driver_info.directions_to_customer:
#             directions_to_customer = nearest_driver_info.directions_to_customer
#         else:
#             directions_to_customer = get_directions(nearest_walmart_location, {
#                 "location": {
#                     "latitude": lat,
#                     "longitude": lng
#                 }
#             })

#             nearest_driver_info.directions_to_customer = directions_to_customer
#             db.session.add(nearest_driver_info)
#             db.session.commit()

#         directions = {
#             "to_walmart": directions_to_walmart["directions"],
#             "to_customer": directions_to_customer["directions"],
#             "estimated_time": directions_to_walmart["estimated_time"] + directions_to_customer["estimated_time"]
#         }

#         return {
#             "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
#             "walmart_location": nearest_walmart_location,
#             "directions": directions,
#             "estimated_time": directions["estimated_time"]
#         }

#     location = Location(customer_id=customer_id, latitude=lat, longitude=lng)
#     db.session.add(location)
#     db.session.commit()

#     nearest_driver_info = find_nearest_driver(customer_id, lat, lng)
#     nearest_walmart_location = find_nearest_walmart(lat, lng)
    
#     if not nearest_walmart_location:
#         return {
#             "error": "No Walmart locations found",
#             "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
#             "walmart_location": None
#         }
#     directions = get_directions(nearest_driver_info.to_dict(), nearest_walmart_location)
#     return {
#         "driver": nearest_driver_info.to_dict() if nearest_driver_info else None,
#         "walmart_location": nearest_walmart_location,
#         "directions": directions["directions"],
#         "estimated_time": directions["estimated_time"]
#     }
