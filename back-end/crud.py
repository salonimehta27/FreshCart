from model import db, User,Product,CustomerRep,Customer, Driver,Cart,CartProduct, connect_to_db
from math import radians, sin, cos, sqrt, atan2

def create_user(fname, lname, username, email, password, role):
    user = User(
        fname=fname,
        lname=lname,
        username=username,
        email=email,
        password=password,
        role=role
    )
    db.session.add(user)
    return user


def create_customer(user, address = None, phone_number = None):
    customer = Customer(
        user=user,
        address=address,
        phone_number=phone_number
    )
    db.session.add(customer)
    return customer


def create_customer_rep(user):
    customer_rep = CustomerRep(user=user)
    db.session.add(customer_rep)
    return customer_rep


def create_driver(user,car_model, license_plate):
    driver = Driver(
        user=user,
        car_model=car_model,
        license_plate=license_plate
    )
    db.session.add(driver)
    return driver



def signup(fname, lname, username, email, password, role, address=None, phone_number=None,car_model=None, license_plate=None):
    user = create_user(fname, lname, username, email, password, role)
    if role == "customer":
        returnVal = create_customer(user, address, phone_number)
    elif role == "customer_rep":
        returnVal = create_customer_rep(user)
    elif role == "driver":
        returnVal = create_driver(user, car_model, license_plate)
    else:
        return {"error": "Invalid role"}
    db.session.commit()

    return {"user":returnVal}

def update_customer_info(user_id, address=None, phone_number=None):
    customer = Customer.query.filter_by(user_id=user_id).first()

    if customer is None:
        return {"error": "Customer not found"}
    if address is not None:
        customer.address = address
    if phone_number is not None:
        customer.phone_number = phone_number

    db.session.commit()

    return {"success": True}


def update_driver_info(user_id,car_model=None, license_plate=None):
    driver = Driver.query.filter_by(user_id=user_id).first()

    if driver is None:
        return {"error": "Driver not found"}
    if car_model is not None:
        driver.car_model = car_model
    if license_plate is not None:
        driver.license_plate = license_plate

    db.session.commit()

    return {"success": True}


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

def get_all_products():
    return Product.query.all()

def get_product_details(id):
    return Product.query.get(id)

def get_user_by_email(email):
    return User.query.filter(User.email == email).first()

def get_customer_by_id(id):
    customer = Customer.query.get(id)
    if customer is not None:
        return customer
def get_customer_rep_by_id(id):
    CustomerRep = CustomerRep.query.get(id)
    if CustomerRep is not None:
        return CustomerRep
    
if __name__ == '__main__':
    from server import app 
    connect_to_db(app)