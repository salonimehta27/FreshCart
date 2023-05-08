
import os
import json 
from random import choice, randint 
from datetime import datetime
import requests
from flask import Flask, jsonify
from model import connect_to_db, db
from server import app

import crud 
import model 
import server 

api_url = f"https://api.spoonacular.com/food/products/search?query=grocery&number=50&apiKey={os.environ.get('apiKey')}"

with app.app_context():
    connect_to_db(app)

def get_data():
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()
        print(jsonify(data))
    else:
        return "Error: Failed to retrieve data from API"
get_data()

os.system('dropdb freshcart')
os.system('createdb freshcart')

model.connect_to_db(server.app)
model.db.create_all()

model.db.session.commit()