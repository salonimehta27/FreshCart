import React, { useState } from "react";
import CustomerQueryItem from "./CustomerQueryItem";

function CustomerQueries() {
	const [queries, setQueries] = useState([
		{
			id: 1,
			customerName: "John Doe",
			query: "I have a problem with my order",
		},
		{ id: 2, customerName: "Jane Doe", query: "I want to cancel my order" },
		{ id: 3, customerName: "Bob Smith", query: "My order was delivered late" },
	]);

	return (
		<div>
			<h2>Customer Queries</h2>
			{queries.map((query) => (
				<CustomerQueryItem key={query.id} query={query} />
			))}
		</div>
	);
}

export default CustomerQueries;
