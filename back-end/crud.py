from model import db, User,Product, connect_to_db

def create_user(email, password):
    user = User(email=email, password=password)
    return user

def get_all_products():
    return Product.query.all()

def get_product_details(id):
    return Product.query.get(id)


if __name__ == '__main__':
    from server import app 
    connect_to_db(app)