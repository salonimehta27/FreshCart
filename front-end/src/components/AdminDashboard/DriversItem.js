import React from "react";

function DriversItem({ driver }) {
	return (
		<div>
			<h2>{driver.name}</h2>
			<p>License: {driver.license}</p>
			<p>Availability: {driver.available ? "Available" : "Unavailable"}</p>
		</div>
	);
}

export default DriversItem;
