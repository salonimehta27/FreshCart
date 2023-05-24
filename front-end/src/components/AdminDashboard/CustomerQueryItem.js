import React from "react";

function CustomerQueryItem({ query, queries, setQueries }) {
	function handleClick(id) {
		fetch(`http://localhost:5000/accept-query/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				is_accepted: true,
			}),
		})
			.then((r) => r.json())
			.then((data) =>
				setQueries(() => {
					let get_query = queries.filter((query) => query.id === data.id);
					get_query["is_accepted"] = true;
				})
			);
	}
	return (
		<div className="card mb-3">
			<div className="card-body">
				<h2></h2>
				<h3 className="card-title">needs assistance: {query.message}</h3>
				<p className="card-text">{query.is_accepted}</p>
				<button onClick={handleClick(query.id)} className="btn btn-primary">
					Attend
				</button>
			</div>
		</div>
	);
}

export default CustomerQueryItem;
