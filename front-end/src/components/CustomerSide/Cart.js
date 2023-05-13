import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	cartItemsAdded,
	cartItemsRemoved,
	cartItemsUpdated,
	cartItemsCleared,
} from "./cartsSlice";

import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

function Cart() {
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.carts.items);

	// Update cart item quantity
	const handleQuantityChange = (id, quantity) => {
		dispatch(cartItemsUpdated({ id, quantity }));
	};

	useEffect(() => {
		fetch("http://localhost:5000/myCart", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(cartItemsAdded(data));
			});
	}, []);

	// Remove item from cart
	const handleRemoveItem = (id) => {
		fetch(`http://localhost:5000/cart/${id}`, {
			method: "DELETE",
		})
			.then((r) => r.json())
			.then(() => dispatch(cartItemsRemoved(id)));
	};

	// Clear cart
	const handleClearCart = () => {
		dispatch(cartItemsCleared());
	};

	// Calculate total price of all items in cart
	const totalPrice =
		cartItems &&
		cartItems.cart_products &&
		cartItems.products &&
		cartItems.cart_products.reduce((total, item) => {
			const product = cartItems.products.find((p) => p.id === item.product_id);
			return total + product.price * item.quantity;
		}, 0);

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Shopping Cart</h2>
			<MDBTable>
				<MDBTableHead>
					<tr>
						<th>Product</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Total</th>
						<th>Actions</th>
					</tr>
				</MDBTableHead>
				<MDBTableBody>
					{cartItems &&
						cartItems.cart_products &&
						cartItems.cart_products.map((item) => {
							const product = cartItems.products.find(
								(p) => p.id === item.product_id
							);
							return (
								<tr key={item.id}>
									<td>
										<div className="d-flex align-items-center">
											<img
												src={product.image}
												alt={product.title}
												className="mr-3"
												style={{ maxWidth: "70px" }}
											/>
											<div>
												<h5>{product.title}</h5>
												<p className="mb-0">${product.price.toFixed(2)}</p>
											</div>
										</div>
									</td>
									<td>
										<input
											type="number"
											min="1"
											value={item.quantity}
											onChange={(e) =>
												handleQuantityChange(item.id, e.target.value)
											}
										/>
									</td>
									<td>${product.price.toFixed(2)}</td>
									<td>${(product.price * item.quantity).toFixed(2)}</td>
									<td>
										<button
											className="btn btn-danger"
											onClick={() => handleRemoveItem(item.id)}
										>
											Remove
										</button>
									</td>
								</tr>
							);
						})}
				</MDBTableBody>
				<tfoot>
					<tr>
						<td colSpan="3">Total:</td>
						<td>${totalPrice ? totalPrice.toFixed(2) : "0.00"}</td>
						<td>
							<button className="btn btn-secondary" onClick={handleClearCart}>
								Clear cart
							</button>
						</td>
					</tr>
				</tfoot>
			</MDBTable>
		</div>
	);
}

export default Cart;
