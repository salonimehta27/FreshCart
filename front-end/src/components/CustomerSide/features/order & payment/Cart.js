import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	cartItemsAdded,
	cartItemsRemoved,
	cartItemsUpdated,
	cartItemsCleared,
} from "./cartsSlice";
import { Link } from "react-router-dom";
import "./Cart.css";
import { FaTrashAlt } from "react-icons/fa";
import visa from "../../images/visa.png";
import mc from "../../images/mc.png";
import amex from "../../images/amex.png";
import PaymentForm from "./PaymentForm";
import { Modal, Button } from "react-bootstrap";

function Cart() {
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.carts.items);
	const currentUser = useSelector((state) => state.currentUser.entities);
	const [checkoutVisible, setCheckoutVisible] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
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
	// Update cart item quantity
	// console.log(currentUser);
	const handleQuantityChange = (id, quantity) => {
		fetch(`http://localhost:5000/cart/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				quantity: quantity,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(cartItemsUpdated({ id, quantity }));
			});
	};

	// Remove item from cart
	const handleRemoveItem = (id) => {
		fetch(`http://localhost:5000/cart/${id}`, {
			method: "DELETE",
			credentials: "include",
		})
			.then((r) => r.json())
			.then(() => dispatch(cartItemsRemoved(id)));
	};

	// Clear cart
	const handleClearCart = () => {
		dispatch(cartItemsCleared());
	};

	const handleClick = () => {
		alert("payyyyyyy ");
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
			<div className="row">
				<div className="col-md-8">
					<h2 className="mb-4">Shopping Cart</h2>
					<table className="table">
						<thead>
							<tr>
								<th>Product</th>
								<th>Quantity</th>
								<th>Price</th>
								<th>Total</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
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
												<div className="input-group">
													<div className="input-group-prepend">
														<button
															className="btn btn-outline-secondary"
															onClick={() =>
																handleQuantityChange(
																	item.product_id,
																	item.quantity - 1
																)
															}
															disabled={item.quantity <= 1}
														>
															-
														</button>
													</div>
													<input
														type="number"
														min="1"
														value={item.quantity}
														onChange={(e) =>
															handleQuantityChange(
																item.product_id,
																e.target.value
															)
														}
														className="form-control"
														style={{ textAlign: "center" }}
													/>
													<div className="input-group-append">
														<button
															className="btn btn-outline-secondary"
															onClick={() =>
																handleQuantityChange(
																	item.product_id,
																	item.quantity + 1
																)
															}
														>
															+
														</button>
													</div>
												</div>
											</td>
											<td>${product.price.toFixed(2)}</td>
											<td>${(product.price * item.quantity).toFixed(2)}</td>
											<td>
												<button
													className="btn btn-outline-danger"
													onClick={() => handleRemoveItem(product.id)}
												>
													<FaTrashAlt />
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
				<div className="col-md-4">
					<div className="card mb-4">
						<div className="card-body">
							<h5 className="card-title">Summary</h5>
							{cartItems.cart_products && (
								<>
									<p>Total items: {cartItems.cart_products.length}</p>
									<p>
										Total price: ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
									</p>
									{currentUser && !currentUser.error ? (
										// <button
										// 	onClick={() => {
										// 		window.location.href = `/payment?cartItems=${encodeURIComponent(
										// 			JSON.stringify(cartItems)
										// 		)}`;
										// 	}}
										// 	className="btn btn-primary"
										// >
										// 	Go to Checkout
										// </button>
										<>
											<button
												onClick={handleOpenModal}
												className="btn btn-primary"
											>
												Go to Checkout
											</button>
											<Modal
												show={showModal}
												onHide={handleCloseModal}
												style={{ marginTop: "150px" }}
											>
												<Modal.Header closeButton>
													<Modal.Title>Checkout</Modal.Title>
												</Modal.Header>
												<Modal.Body>
													<PaymentForm cartItems={cartItems} />
												</Modal.Body>
												<Modal.Footer>
													<Button
														variant="secondary"
														onClick={handleCloseModal}
													>
														Close
													</Button>
												</Modal.Footer>
											</Modal>
										</>
									) : (
										<>
											<a href="/login" className="btn btn-secondary">
												Login to place an order
											</a>
										</>
									)}
								</>
							)}
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<h5 className="card-title">We Accept</h5>
							<div className="d-flex">
								<img src={visa} alt="Visa" className="mr-2 card-icon" />
								<img src={mc} alt="Mastercard" className="mr-2 card-icon" />
								<img
									src={amex}
									alt="American Express"
									className="mr-2 card-icon"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cart;
