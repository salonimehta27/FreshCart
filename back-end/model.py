from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
import re

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(255))
    lname = db.Column(db.String(255))
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = db.relationship('Customer', back_populates='user', uselist=False)
    customer_rep = db.relationship('CustomerRep', back_populates='user', uselist=False)
    # driver = db.relationship('Driver', back_populates='user', uselist=False)

    

    def __repr__(self):
        return f'<User {self.id} {self.username}>'
    
class CustomerRep(db.Model):
    __tablename__ = 'customer_reps'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = db.relationship("User", back_populates="customer_rep")
    chats = db.relationship("Chat", back_populates="customer_rep")
    queries = db.relationship("Query", back_populates="customer_rep")
    def __repr__(self):
        return f'<CustomerRep id={self.id} fname={self.user.fname} user_id={self.user_id}>'
    
class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    phone_number = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    user = db.relationship('User', back_populates='customer')
    cart = db.relationship('Cart', back_populates='customer', lazy=True)
    locations = db.relationship('Location', back_populates='customer')
    orders = db.relationship("Order", back_populates="customer")
    chats = db.relationship("Chat", back_populates="customer")
    queries = db.relationship("Query", back_populates="customer")

    def __repr__(self):
        return f'<Customer id={self.id} user_id={self.user_id}>'

class Driver(db.Model):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))
    car_model = db.Column(db.String(255), nullable=False)
    license_plate = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    location = db.relationship('Location', back_populates='driver')
    orders = db.relationship("Order", back_populates="driver")

    # def get_location(self):
    #     return {"latitude":self.location.latitude, "longitude": self.location.longtitude}
    
    def get_location(self):
        locations = []
        for location in self.location:
            locations.append({"latitude": location.latitude, "longitude": location.longitude})
        return locations[0]

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "car_model": self.car_model,
            "license_plate": self.license_plate,
            "location": {
                "latitude": str(self.get_location()["latitude"]),  # Convert to string for JSON serialization
                "longitude": str(self.get_location()["longitude"])  # Convert to string for JSON serialization
            }
    }
    def __repr__(self):
        return f'<Driver id={self.id} car_model={self.car_model}>'

class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    latitude = db.Column(db.Numeric, nullable=False)
    longitude = db.Column(db.Numeric, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    customer = db.relationship('Customer', back_populates='locations')
    driver = db.relationship('Driver', back_populates='location')

    def __repr__(self):
        return f'<Location id={self.id} customer_id={self.customer_id} driver_id={self.driver_id}>'


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    aisle = db.Column(db.String)
    brand = db.Column(db.String)
    badges = db.Column(db.ARRAY(db.String))
    description = db.Column(db.String)
    image = db.Column(db.String)
    images = db.Column(db.ARRAY(db.String))
    price = db.Column(db.Float)
    title = db.Column(db.String)
    product_id = db.Column(db.Integer, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    order_items = db.relationship("OrderItem", back_populates="product")
    cart_products = db.relationship("CartProduct", back_populates="product")

    
    def to_dict(self):
        return {
            'id': self.id,
            'aisle': self.aisle,
            'brand': self.brand,
            'badges': self.badges,
            'description': self.description if self.description else None,
            'image': self.image,
            'images': self.images,
            'price': self.price,
            'title': self.title,
            'product_id': self.product_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    def __repr__(self):
        return f"<Product {self.product_id}>"

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    total = db.Column(db.Float, nullable=False, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    driver_id = db.Column(db.Integer, db.ForeignKey("drivers.id", ondelete="CASCADE"), nullable=True)
    address = db.Column(db.String)
    order_status = db.Column(db.String)
    customer = db.relationship("Customer", back_populates="orders")
    driver = db.relationship("Driver", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    queries = db.relationship("Query", back_populates="order")
   
    def to_dict(self):
        driver = Driver.query.get(self.driver_id)
        driver_dict = driver.to_dict() if driver else None
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "total": self.total,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "driver": driver_dict,
            "address": self.address,
            "order_status": self.order_status,
            "order_items": [item.to_dict(include_product=True) for item in self.order_items],
        }

    def __repr__(self):
        return f"<Order {self.id}>"
    
class OrderItem(db.Model):
    __tablename__ = "order_items"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Backpopulated relationships
    order = db.relationship("Order", back_populates="order_items")
    product = db.relationship("Product", back_populates="order_items")

    def to_dict(self, include_product=False):
        data = {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price": self.price,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        
        if include_product:
            data["product"] = self.product.to_dict()

        return data

    def __repr__(self):
        return f"<OrderItem {self.id}>"
    
class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart_products = db.relationship("CartProduct", back_populates="cart", cascade="save-update, merge, delete, delete-orphan")
    customer = db.relationship("Customer", back_populates="cart")
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'cart_products': [cp.to_dict() for cp in self.cart_products],
        }
    def __repr__(self):
        return f"<Cart {self.id}>"

class CartProduct(db.Model):
    __tablename__ = "cart_products"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart = db.relationship("Cart", back_populates="cart_products")
    product = db.relationship("Product", back_populates="cart_products")

    def __init__(self, cart_id, product_id, quantity):
        self.cart_id = cart_id
        self.product_id = product_id
        self.quantity = quantity

    def to_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    def __repr__(self):
        return f"<CartProduct cart_id={self.cart_id} product_id={self.product_id} quantity={self.quantity}>"

class Chat(db.Model):
    __tablename__ = "chats"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    customer = db.relationship("Customer", back_populates="chats")

    customer_rep_id = db.Column(db.Integer, db.ForeignKey("customer_reps.id"), nullable=True)
    customer_rep = db.relationship("CustomerRep", back_populates="chats")

    query_id = db.Column(db.Integer, db.ForeignKey("queries.id"), nullable=False)
    query_obj = db.relationship("Query", back_populates="chat")

    messages = db.relationship("ChatMessage", back_populates="chat", cascade="all, delete-orphan")


    def __repr__(self):
        return f"<Chat id={self.id}>"
    
class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id"), nullable=False)
    chat = db.relationship("Chat", back_populates="messages")

    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=True)
    customer = db.relationship("Customer")

    customer_rep_id = db.Column(db.Integer, db.ForeignKey("customer_reps.id"), nullable=True)
    customer_rep = db.relationship("CustomerRep")


    def __repr__(self):
        return f"<ChatMessage id={self.id} chat_id={self.chat_id}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "chat_id": self.chat_id,
            "customer_id": self.customer_id,
            "customer_rep_id": self.customer_rep_id
        }
class Query(db.Model):
    __tablename__ = 'queries'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message = db.Column(db.String(500), nullable=False)
    is_accepted = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    customer_rep_id = db.Column(db.Integer, db.ForeignKey('customer_reps.id'), nullable=True)

    # Relationship backpopulates
    order = db.relationship('Order', back_populates="queries")
    customer = db.relationship('Customer', back_populates='queries')
    customer_rep = db.relationship('CustomerRep', back_populates='queries')
    chat = db.relationship("Chat", back_populates="query_obj")
    def __repr__(self):
        return f'<Query id={self.id} message={self.message} is_accepted={self.is_accepted}>'

    def to_dict(self):
        customer = db.session.query(Customer).get(self.customer_id)
        customer_fname = customer.user.fname if customer else None
        customer_lname = customer.user.lname if customer else None
        return {
            'id': self.id,
            'message': self.message,
            'is_accepted': self.is_accepted,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'customer_rep_id': self.customer_rep_id,
            'customer_fname':customer_fname,
            'customer_lname':customer_lname
        }
def connect_to_db(flask_app, db_uri="postgresql:///freshcart", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    db.create_all()
    # app.run()
  
