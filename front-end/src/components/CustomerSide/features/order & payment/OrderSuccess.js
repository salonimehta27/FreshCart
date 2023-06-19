/*global google*/
import React, { useEffect } from "react";
import MapComponent from "./MapComponent";
import { useSelector } from "react-redux";
function OrderSuccess() {
	const address = useSelector((state) => state.currentUser.address);
	return (
		<div>
			<MapComponent address={address} />
		</div>
	);
}

export default OrderSuccess;
