from model import db, User,Product,Customer,Cart,CartProduct, connect_to_db
from server import session

def create_cart_product(cart_id, product_id, quantity):
    cart_product = CartProduct(cart_id=cart_id, product_id=product_id, quantity=quantity)
    db.session.add(cart_product)
    db.session.commit()
    return cart_product


def create_cart(customer_id=None):
    cart = Cart()
    cart.customer_id = customer_id
    db.session.add(cart)
    db.session.commit()
    return cart

def get_cart_by_id(cart_id):
    return Cart.query.filter_by(id=cart_id).first()

def add_product_to_cart(product_id, quantity):
    if 'user_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is None:
            user_cart = create_cart(customer_id=session['user_id'])
            db.session.commit()

        cart_product = CartProduct.query.filter_by(cart_id=user_cart.id, product_id=product_id).first()
        if cart_product is None:
            create_cart_product(user_cart.id, product_id, quantity)
        else:
            cart_product.quantity += quantity
            db.session.commit()
    else:
        if 'guest_cart_id' not in session:
            # print("session", session)
            guest_cart = Cart()
            db.session.add(guest_cart)
            db.session.commit()
            session['guest_cart_id'] = guest_cart.id
           
        else:
            guest_cart = get_cart_by_id(session['guest_cart_id'])
        # import pdb; pdb.set_trace()
        cart_product = CartProduct.query.filter_by(cart_id=guest_cart.id, product_id=product_id).first()
        if cart_product is None:
            create_cart_product(guest_cart.id, product_id, quantity)
        else:
            cart_product.quantity += quantity
            db.session.commit()

def get_cur_cart():
    if 'user_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is None:
            user_cart = create_cart(customer_id=session['user_id'])
            db.session.commit()
    elif 'guest_cart_id' in session:
        user_cart = get_cart_by_id(session['guest_cart_id'])
    else:
        return {'error': 'No cart found'}

    cart_dict = user_cart.to_dict()
    products = get_products_in_cart(user_cart.id)
    product_dicts = [product.to_dict() for product in products]
    cart_dict['products'] = product_dicts

    return cart_dict

def merge_carts(guest_cart, user_cart):
    db.session.refresh(user_cart)
    for guest_cart_product in guest_cart.cart_products:
        # import pdb; pdb.set_trace()
        matching_user_cart_product = next((cp for cp in user_cart.cart_products if cp.product_id == guest_cart_product.product_id), None)
        if matching_user_cart_product is not None:
            matching_user_cart_product.quantity += guest_cart_product.quantity
        else:
            cart_prod = create_cart_product(user_cart.id, guest_cart_product.product_id, guest_cart_product.quantity)
            db.session.add(cart_prod)
            
            db.session.commit()
    db.session.delete(guest_cart)
    db.session.commit()

def merge_guest_cart():
    
    if 'user_id' in session and 'guest_cart_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is None:
            user_cart = Cart(customer_id = session['user_id'])
            db.session.add(user_cart)
            db.session.commit()
        guest_cart = get_cart_by_id(session['guest_cart_id'])
        db.session.flush()
        merge_carts(guest_cart, user_cart)
        del session['guest_cart_id']

def get_cart_by_customer_id(user_id):
    return Cart.query.filter_by(customer_id=user_id).first()

def get_products_in_cart(cart_id):
    cart_products = CartProduct.query.filter_by(cart_id=cart_id).all()
    products = []
    for cart_product in cart_products:
        product = Product.query.get(cart_product.product_id)
        if product is not None:
            products.append(product)
    
    # Check if the user has a cart and get the products in that cart
    if 'user_id' in session:
        user_cart = Cart.query.filter_by(customer_id=session['user_id']).first()
        if user_cart is not None and user_cart.id != cart_id:
            user_products = get_products_in_cart(user_cart.id)
            products.extend(user_products)

    return products

def remove_product_from_cart(cart_id, product_id):
    cart = get_cart_by_id(cart_id)
    if cart is None:
        return
    cart_product = CartProduct.query.filter_by(cart_id=cart.id, product_id=int(product_id)).first()
    if cart_product is None:
        return
    cart.cart_products.remove(cart_product)
    db.session.delete(cart_product)
    db.session.commit()
    

def update_cart_product_quantity(cart_id, product_id, quantity):
    cart = get_cart_by_id(cart_id)
    # import pdb; pdb.set_trace()
    if cart is None:
        return
    cart_product = CartProduct.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_product is None:
        return
    cart_product.quantity = quantity
    db.session.commit()

def create_cart_response(cart, cart_id):
    cart_dict = cart.to_dict()
    products = get_products_in_cart(cart_id)
    product_dicts = [product.to_dict() for product in products]
    cart_dict['products'] = product_dicts
    return cart_dict


if __name__ == '__main__':
    from server import app 
    connect_to_db(app)
# def create_cart(user_id):
#     customer = Customer.query.filter_by(user_id=user_id).first()
#     if not customer:
#         return None
#     cart = Cart(customer=customer)
#     db.session.add(cart)
#     db.session.commit()
#     return cart