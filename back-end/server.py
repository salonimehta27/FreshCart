from flask import (Flask, render_template, request, flash, session, redirect) 
from model import connect_to_db, db
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
import requests
import os
import crud
app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"


os.system("source secrets.sh")
api_key = os.environ['API_KEY']


# @app.route("/")
# def get_data():
#     api_url = f"https://api.spoonacular.com/food/products/search?query=grocery&number=10&apiKey={api_key}"
    
#     response = requests.get(api_url)
#     if response.status_code == 200:
#         data = response.json()
#         products = data.get('products', [])
#         print(products)
#         grocery_items = []
#         for product in products:
#             get_product = f"https://api.spoonacular.com/food/products/{product['id']}?apiKey={api_key}"
#             product_response = requests.get(get_product)
#             if product_response.status_code == 200:
#                 product_data = product_response.json()
#                 grocery_items.append(product_data)
#         return jsonify(grocery_items)
#     else:
#         return "Error retrieving data"

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
