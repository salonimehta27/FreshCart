import React from "react";

function CustomerQueryItem({ query }) {
	return (
		<div>
			<h3>{query.customerName}</h3>
			<p>{query.query}</p>
			<button>Attend</button>
		</div>
	);
}

export default CustomerQueryItem;
