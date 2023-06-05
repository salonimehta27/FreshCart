import React from "react";
import { useDispatch } from "react-redux";
import { cartItemsAdded } from "./cartsSlice";

const OrderDetailsPage = ({ order }) => {
	const { address, order_items } = order;
	const parsedAddress = JSON.parse(address);
	const dispatch = useDispatch();

	const handleCart = (e, product_id) => {
		e.preventDefault();
		fetch("http://localhost:5000/add_to_cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ product_id: product_id, quantity: 1 }),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(cartItemsAdded(data));
			});
	};

	return (
		<div className="container mt-4">
			<h2>Order Details</h2>
			<div>
				<h4>Delivery Address:</h4>
				<p style={{ margin: "0" }}>{parsedAddress.line1}</p>
				{parsedAddress.line2 && <p>{parsedAddress.line2}</p>}
				<p>
					{parsedAddress.city}, {parsedAddress.state}, {parsedAddress.country}{" "}
					{parsedAddress.postal_code}
				</p>
			</div>

			<div>
				<h4>Driver Details:</h4>
				<p>Driver Name: {order.driver.name}</p>
			</div>
			<div style={{ marginTop: "10px" }}>
				<h4>Order Total:</h4>
				<p>Total: ${order.total}</p>
			</div>
			<h4>Order Items:</h4>
			<div className="row">
				{order_items.map((item) => (
					<div key={item.id} className="col-md-4 mb-4">
						<div className="card h-100">
							<img
								src={item.product.image}
								alt={item.product.title}
								className="card-img-top img-fluid"
								style={{ objectFit: "contain", height: "100px" }}
							/>
							<div className="card-body d-flex flex-column justify-content-between">
								<div style={{ margin: "0" }}>
									<h6 className="card-title">{item.product.title}</h6>
									<p className="card-text">Quantity: {item.quantity} </p>
									<p className="card-text">Price: ${item.price}</p>
								</div>
								<div>
									<button
										className="btn btn-primary"
										style={{ backgroundColor: "#08AC0A", color: "#FFFFFF" }}
										onClick={(e) => handleCart(e, item.product.id)}
									>
										Buy Again
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderDetailsPage;
