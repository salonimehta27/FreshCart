from model import db, User,Product,CustomerRep,Customer, Driver,Cart,CartProduct, connect_to_db
from server import session


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

def create_cart_product(cart_id, product_id, quantity):
    cart_product = CartProduct(cart_id=cart_id, product_id=product_id, quantity=quantity)
    db.session.add(cart_product)
    db.session.commit()

def create_cart(customer_id=None):
    cart = Cart()
    if customer_id is not None:
        cart.customer_id = customer_id
    db.session.add(cart)
    db.session.commit()
    return cart

def get_cart_by_id(cart_id):
    return Cart.query.filter_by(id=cart_id).first()

def merge_carts(guest_cart, user_cart):
    for guest_cart_product in guest_cart.cart_products:
        matching_user_cart_product = next((cp for cp in user_cart.cart_products if cp.product_id == guest_cart_product.product_id), None)
        if matching_user_cart_product is not None:
            matching_user_cart_product.quantity += guest_cart_product.quantity
        else:
            create_cart_product(user_cart.id, guest_cart_product.product_id, guest_cart_product.quantity)
    db.session.delete(guest_cart)
    db.session.commit()

def add_product_to_cart(product_id, quantity):
    if 'user_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is None:
            user_cart = create_cart(customer_id=session['user_id'])
            db.session.commit()
        create_cart_product(user_cart.id, product_id, quantity)
    else:
        if 'guest_cart_id' not in session:
            guest_cart = create_cart()
            session['guest_cart_id'] = guest_cart.id
        else:
            guest_cart = get_cart_by_id(session['guest_cart_id'])
        create_cart_product(guest_cart.id, product_id, quantity)

def merge_guest_cart():
    if 'user_id' in session and 'guest_cart_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is None:
            user_cart = create_cart(customer_id=session['user_id'])
            db.session.commit()
        guest_cart = get_cart_by_id(session['guest_cart_id'])
        merge_carts(guest_cart, user_cart)
        del session['guest_cart_id']

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

def get_customer_by_id(id):
    customer = Customer.query.get(id)
    if customer is not None:
        return customer

if __name__ == '__main__':
    from server import app 
    connect_to_db(app)