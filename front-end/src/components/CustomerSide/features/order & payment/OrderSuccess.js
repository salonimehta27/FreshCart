/*global google*/
import React, { useEffect } from "react";
import MapComponent from "./MapComponent";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
function OrderSuccess() {
	const address = useSelector((state) => state.currentUser.address);
	//const order = useSelector((state) => state.order.currentOrder);
	// const orderValue = localStorage.getItem("order");
	// const order = JSON.parse(orderValue);
	// console.log(address);
	return (
		<div>
			{/* {order && order.order_status === "DELIVERED" && (
				<>
					<h2> Order is Delivered</h2>
				</>
			)} */}

			<MapComponent address={address} />
		</div>
	);
}

export default OrderSuccess;
