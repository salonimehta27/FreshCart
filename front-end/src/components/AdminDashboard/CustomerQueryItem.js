import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAdminChatMessages } from "./adminChatSlice";
import socket from "../../socket";
import { useState, useEffect } from "react";
function CustomerQueryItem({
	query,
	queries,
	setQueries,
	currentRep,
	showChatBox,
	handleShowClick,
}) {
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	// Initialize the Socket.IO client connection

	// 	return () => {
	// 		// Clean up the socket connection when the component unmounts
	// 		socket.disconnect();
	// 	};
	// }, []);

	function handleClick(id) {
		// console.log(currentRep);
		fetch(`http://localhost:5000/accept-query/${id}`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				is_accepted: true,
				customer_rep_id: currentRep.customer_rep_id,
			}),
		})
			.then((r) => r.json())
			.then((data) => {
				setQueries((prevQueries) => {
					const updatedQueries = prevQueries.filter(
						(q) => q.id !== data.query.id
					);
					return updatedQueries;
				});
				console.log(data);
				dispatch(loadAdminChatMessages(data.messages));
				//setChatMessages(data.messages);
				handleShowClick(data.chat_id);
				// console.log(showChatBox);
			});
	}

	return (
		<div className="card mb-3">
			<div className="card-body">
				<h2></h2>
				<h3 className="card-title">Needs Assistance: {query.message}</h3>
				<p className="card-text">{query.is_accepted}</p>
				<button
					onClick={() => handleClick(query.id)}
					className="btn btn-primary"
				>
					Attend
				</button>
			</div>
		</div>
	);
}

export default CustomerQueryItem;
