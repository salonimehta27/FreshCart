import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderDetailsPage = ({ order }) => {
	return (
		<div className="container mt-5">
			<div className="card">
				<div className="card-header">
					<h2>Order Details</h2>
				</div>
				<div className="card-body">
					<h5>Order ID: {order.id}</h5>
					<h5>Order Date: {order.date}</h5>
					<h5>Order Status: {order.status}</h5>
					<h5>Car Details: {order.carDetails}</h5>
					<h5>Store: {order.store}</h5>
					<h5>Store Address: {order.storeAddress}</h5>
					<h5>Estimated Delivery Time: {order.estimatedTime}</h5>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailsPage;
