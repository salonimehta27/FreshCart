import React, { useState, useEffect } from "react";
import CustomerQueryItem from "./CustomerQueryItem";
import { useSelector } from "react-redux";

function CustomerQueries() {
	const [queries, setQueries] = useState([]);
	const currentrep = useSelector((state) => state.currentRep.entities);
	const [showChatBox, setShowChatBox] = useState(false);

	function handleClick(val) {
		// Update the showChatBox state
		setShowChatBox(() => val);

		// Rest of your code
	}
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

			{queries ? (
				queries.map((query) => (
					<CustomerQueryItem
						key={query.id}
						query={query}
						queries={queries}
						setQueries={setQueries}
						currentRep={currentrep}
						showChatBox={showChatBox}
						handleShowClick={handleClick}
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
