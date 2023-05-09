import os
import json 
from random import choice, randint 
from datetime import datetime
import requests
from flask import Flask, jsonify
from model import connect_to_db, db, Product
from server import app

import crud 
import model 
import server 


os.system('dropdb freshcart')
os.system('createdb freshcart')

connect_to_db(app)
db.create_all()

os.system("source secrets.sh")
api_key = os.environ['API_KEY']

api_url = f"https://api.spoonacular.com/food/products/search?query=grocery&number=50&apiKey={api_key}"

response = requests.get(api_url)
if response.status_code == 200:
    data = response.json()
    products = data.get('products', [])
    for product in products:
        get_product = f"https://api.spoonacular.com/food/products/{product['id']}?apiKey={api_key}"
        product_response = requests.get(get_product)
        if product_response.status_code == 200:
            product_data = product_response.json()
            new_product = Product(
                aisle=product_data.get('aisle'),
                brand=product_data.get('brand'),
                badges=product_data.get('badges'),
                description=product_data.get('description'),
                image=product_data.get('image'),
                images=product_data.get('images'),
                price=product_data.get('price'),
                title=product_data.get('title'),
                product_id = product_data.get("id")
            )
            db.session.add(new_product)
    db.session.commit()
    print("Products seeded successfully")
else:
    print("Error retrieving data")

db.session.commit()