from model import db, User,Product,CustomerRep,Customer, Driver,Cart, connect_to_db

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
    # Create a new user
    user = create_user(fname, lname, username, email, password, role)

    # Check the role and create the appropriate model instance
    if role == "customer":
        customer = create_customer(user, address, phone_number)
    elif role == "customer_rep":
        customer_rep = create_customer_rep(user)
    elif role == "driver":
        driver = create_driver(user, car_model, license_plate)
    else:
        # Invalid role
        return {"error": "Invalid role"}

    # Commit the changes to the database
    db.session.commit()

    return {"success": True}

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


def update_driver_info(user_id, name=None, car_model=None, license_plate=None):
    driver = Driver.query.filter_by(user_id=user_id).first()

    if driver is None:
        return {"error": "Driver not found"}

    if name is not None:
        driver.name = name

    if car_model is not None:
        driver.car_model = car_model

    if license_plate is not None:
        driver.license_plate = license_plate

    db.session.commit()

    return {"success": True}

def create_cart(user_id):
    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return None
    cart = Cart(customer=customer)
    db.session.add(cart)
    db.session.commit()
    return cart


def get_all_products():
    return Product.query.all()

def get_product_details(id):
    return Product.query.get(id)

def get_user_by_email(email):
    return User.query.filter(User.email == email).first()


if __name__ == '__main__':
    from server import app 
    connect_to_db(app)