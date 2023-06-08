import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAdminChatMessages } from "./adminChatSlice";
import socket from "../../socket";
import { useState, useEffect } from "react";
import "./queries.css";
import { NavLink } from "react-router-dom";
import { setQueries } from "./querySlice";
function CustomerQueryItem({
	query,
	queries,
	currentRep,
	showChatBox,
	handleShowClick,
	handleCurrentQuery,
}) {
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	// Initialize the Socket.IO client connection

	// 	return () => {
	// 		// Clean up the socket connection when the component unmounts
	// 		socket.disconnect();
	// 	};
	// }, []);
	console.log(query);
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
				console.log(data);
				dispatch(() => {
					setQueries((prevQueries) => {
						const updatedQueries = prevQueries.filter(
							(q) => q.id !== data.query.id
						);
						return updatedQueries;
					});
				});
				console.log(data);
				dispatch(loadAdminChatMessages(data.messages));
				//setChatMessages(data.messages);
				handleShowClick(data.chat_id);
				handleCurrentQuery(id);
				// console.log(showChatBox);
			});
	}

	return (
		<div className="card mb-3 ticket-item">
			<div className="card-body">
				<h2></h2>
				<h3 className="card-title customer-name">
					Needs Assistance: {query.message}
				</h3>
				<p className="card-text">
					Created At: {new Date(query.created_at).toLocaleString()}
				</p>
				<p className="card-text">Customer name: {query.customer_fname}</p>
				<button
					className="btn btn-primary"
					onClick={() => handleClick(query.id)}
				>
					Attend
				</button>
			</div>
		</div>
	);
}

export default CustomerQueryItem;
