from flask import (Flask, render_template, make_response,request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db, User, Customer, CustomerRep, Driver
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
# from flask_session import Session
# from datetime import timedelta
from flask_cors import CORS, cross_origin
import os
import crud
app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"

app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

CORS(app,supports_credentials=True)
os.system("source secrets.sh")
api_key = os.environ['API_KEY']

@app.route("/login", methods = ["POST"])
def process_login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = crud.get_user_by_email(email)
 
    if user is not None:
        if user.password == password:
            session['user_id'] = user.customer.id
            print("process login", session["user_id"])
            crud.merge_guest_cart() # Merge the guest cart with the user's cart, if applicable
            return jsonify({"id":user.customer.id, "fname":user.fname,"lname":user.lname,"username":user.username,"email":user.email,})
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
           return jsonify({"id":user.id, "fname":user.fname,"lname":user.lname,"username":user.username,"email":user.email,"customer_id":session["user_id"]})
    return jsonify({"error": "User not in session"})

@app.route("/")
def homepage():
    flash("Hello")
    return render_template('homepage.html', flash_message=get_flashed_messages())
   
@app.route("/products")
@cross_origin(supports_credentials=True)
def get_products():
    products = crud.get_all_products()
    # print(session)
    products_dict = [product.to_dict() for product in products]
    return jsonify(products_dict)

@app.route("/products/<id>")
@cross_origin(supports_credentials=True)
def product_details(id):
    product = crud.get_product_details(id)
    product_dict = product.to_dict()
    return jsonify(product_dict)


    


@app.route("/logout")
def process_logout():
    session.pop('user_id', None)
    return jsonify(success=True)

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
        # import pdb; pdb.set_trace()
        user_id = result["user"].id
        if role == "customer":
            crud.create_cart(user_id)
        return jsonify({"success": True})

@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    product_id = request.form.get("product_id")
    quantity = request.form.get("quantity")

    crud.add_product_to_cart(product_id, quantity)
    return jsonify(success=True)

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

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
