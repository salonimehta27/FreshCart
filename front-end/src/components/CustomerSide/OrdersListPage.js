import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrdersListPage = ({ orders }) => {
	return (
		<div className="container mt-5">
			<h2>Orders List</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Order ID</th>
						<th>Order Date</th>
						<th>Order Status</th>
						<th>Car Details</th>
						<th>Store</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => (
						<tr key={order.id}>
							<td>{order.id}</td>
							<td>{order.date}</td>
							<td>{order.status}</td>
							<td>{order.carDetails}</td>
							<td>{order.store}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default OrdersListPage;
