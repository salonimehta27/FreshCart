from flask import (Flask, render_template, request, flash,get_flashed_messages, session, redirect) 
from model import connect_to_db, db
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


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
