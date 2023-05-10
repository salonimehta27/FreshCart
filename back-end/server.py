from flask import (Flask, render_template, request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db, User, Customer, CustomerRep, Driver
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
import requests
from flask_cors import CORS
import os
import crud
app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

os.system("source secrets.sh")
api_key = os.environ['API_KEY']


@app.route("/")
def homepage():
    flash("Hello")
    return render_template('homepage.html', flash_message=get_flashed_messages())


@app.route("/products")
def get_products():
    products = crud.get_all_products()
    products_dict = [product.to_dict() for product in products]
    return jsonify(products_dict)

@app.route("/products/<id>")
def product_details(id):
    product = crud.get_product_details(id)
    product_dict = product.to_dict()
    return jsonify(product_dict)

@app.route("/login", methods = ["POST"])
def process_login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)

    if user is not None:
        if user.password == password:
            session['user_id'] = user.id
            crud.merge_guest_cart() # Merge the guest cart with the user's cart, if applicable
            return jsonify(success = True)
        else:
            return jsonify(success=False, error="Incorrect password"), 401
    else:
        return jsonify(success=False, error="User not found"), 401

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

    print(result)
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
