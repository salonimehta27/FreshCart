import React, { useEffect } from "react";
import Map from "./Map";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
function OrderSuccess() {
	const address = useSelector((state) => state.currentUser.address);
	// console.log(address);
	useEffect(() => {}, []);
	return (
		<div>
			<h2>Your order was successful!</h2>
			<p>
				We are connecting you with the nearest driver. They will contact you
				shortly to confirm your delivery details.
			</p>
			<Map address={address} />
		</div>
	);
}

export default OrderSuccess;
