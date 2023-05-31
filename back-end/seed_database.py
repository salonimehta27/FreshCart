import os
import json 
from random import choice, randint, uniform
from datetime import datetime
import requests
from flask import Flask, jsonify
from model import connect_to_db, db, Product, Driver, Location, Customer
from server import app
from faker import Faker
from math import radians, sin, cos, sqrt
import crud 
import model 
import server 


os.system('dropdb freshcart')
os.system('createdb freshcart')

connect_to_db(app)
db.create_all()

os.system("source secrets.sh")
api_key = os.environ['API_KEY']

api_url = f"https://api.spoonacular.com/food/products/search?query=grocery&number=100&apiKey={api_key}"

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



user = crud.create_user("test1", "last", "test1", "test1@test.com", "test", "customer")
customer = crud.create_customer(user)
db.session.commit()

customer_rep = crud.create_user("test_rep", "last", "test_rep", "test_rep@test.com", "test", "customer_rep")
customer_rep_save = crud.create_customer_rep(customer_rep)
fake = Faker()

num_drivers = 10

# Central location (zipcode 10001, NY)
central_latitude = 40.748817
central_longitude = -73.985428

# Radius in miles
radius_miles = 8

# Convert radius to degrees (approximately 1 degree = 69 miles)
radius_degrees = radius_miles / 69.0
car_brands = ["Toyota", "Honda", "Ford", "Chevrolet", "Volkswagen", "Nissan", "Hyundai", "Kia", "Mazda", "Subaru", "Jeep", "Dodge", "Chrysler", "Mitsubishi", "Buick"]

# Generate mock driver data and store in the database
for _ in range(num_drivers):
    # Generate random coordinates within the radius
    u = uniform(0, 1)
    v = uniform(0, 1)
    w = radius_degrees * sqrt(u)
    t = 2 * 3.14159265359 * v
    x = w * cos(t)
    y = w * sin(t)

    # Calculate the new latitude and longitude
    new_latitude = central_latitude + (y / 111.0)
    new_longitude = central_longitude + (x / (111.0 * cos(radians(central_latitude))))

    driver = Driver(
        name=fake.name(),
        car_model=choice(car_brands),
        license_plate=fake.license_plate()
    )

    location = Location(
        latitude=new_latitude,
        longitude=new_longitude,
        driver=driver
    )

    # Add the driver and location objects to the session
    db.session.add(driver)
    db.session.add(location)

db.session.commit()