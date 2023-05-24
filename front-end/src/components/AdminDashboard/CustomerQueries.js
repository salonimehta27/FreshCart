import React, { useState, useEffect } from "react";
import CustomerQueryItem from "./CustomerQueryItem";

function CustomerQueries() {
	const [queries, setQueries] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/queries")
			.then((response) => response.json())
			.then((data) => setQueries(data))
			.catch((error) => console.error(error));
	}, []);
	console.log(queries);
	return (
		<div>
			<h2>Customer Queries</h2>

			{queries !== undefined && !queries && queries.length > 0 ? (
				queries.map((query) => (
					<CustomerQueryItem
						key={query.id}
						query={query}
						queries={queries}
						setQueries={setQueries}
					/>
				))
			) : (
				<>
					<h4>No queries at the moment</h4>
				</>
			)}
		</div>
	);
}

export default CustomerQueries;
