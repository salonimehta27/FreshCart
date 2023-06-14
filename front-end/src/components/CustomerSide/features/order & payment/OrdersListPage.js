import React, { useState, useEffect, useRef } from "react";
import OrderDetailsPage from "./OrderDetailsPage";

const OrdersListPage = ({ orders }) => {
	const [selectedOrderId, setSelectedOrderId] = useState(
		orders.length > 0 ? orders[0].id : null
	);
	const orderDetailsRef = useRef(null);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (
			orderDetailsRef.current &&
			!orderDetailsRef.current.contains(event.target)
		) {
			setSelectedOrderId(null);
		}
	};

	const handleOrderClick = (orderId, event) => {
		if (selectedOrderId === orderId) {
			setSelectedOrderId(null);
		} else {
			setSelectedOrderId(orderId);
		}

		event.stopPropagation(); // Prevent event bubbling
	};

	const renderOrderDetails = () => {
		if (selectedOrderId !== null) {
			const selectedOrder = orders.find(
				(order) => order.id === selectedOrderId
			);
			if (selectedOrder) {
				return <OrderDetailsPage order={selectedOrder} />;
			}
		} else if (orders.length > 0) {
			setSelectedOrderId(orders[0].id); // Set the first order as selected
			return <OrderDetailsPage order={orders[0]} />;
		}
		return null;
	};
	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-3">
					<h1>Orders History</h1>
					{orders ? (
						<ul className="list-group">
							{orders.map((order) => (
								<li
									key={order.id}
									className={`list-group-item ${
										selectedOrderId === order.id ? "active" : ""
									}`}
									style={
										selectedOrderId === order.id
											? {
													backgroundColor: "#08AC0A",
													color: "#FFFFFF",
											  }
											: null
									}
									onClick={(event) => handleOrderClick(order.id, event)}
								>
									Order Number: {order.id}
									<br />
									Created At: {new Date(order.created_at).toLocaleString()}
									<br />
									Order Status: {order.order_status ? "Delivered" : "Pending"}
								</li>
							))}
						</ul>
					) : (
						<h1>No orders yet</h1>
					)}
				</div>
				<div className="col-md-8">
					<div ref={orderDetailsRef}>{renderOrderDetails()}</div>
				</div>
			</div>
		</div>
	);
};

export default OrdersListPage;
