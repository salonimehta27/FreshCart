import React, { useState, useEffect } from "react";
import CustomerQueryItem from "./CustomerQueryItem";
import Chatbox from "./Chatbox";
import { currentRepAdded } from "./AdminSlice";
import socket from "../../socket";

import { useSelector, useDispatch } from "react-redux";
function CustomerQueries() {
	const [queries, setQueries] = useState([]);
	const currentrep = useSelector((state) => state.currentRep.entities);
	const [showChatBox, setShowChatBox] = useState(false);
	// const chatId = useSelector((state) => state.adminChat.chat_id);
	const [chatId, setChatId] = useState();
	const dispatch = useDispatch();
	function handleClick(chatId) {
		// Update the showChatBox state
		console.log(chatId);
		setShowChatBox(true);
		setChatId(chatId);
		// Rest of your code
	}
	useEffect(() => {
		// Listen for incoming chat messages

		socket.on("customer query", (data) => {
			console.log(data);
			setQueries([...queries, data]);
			// Handle the response as needed
		});
	}, []);
	useEffect(() => {
		fetch("http://localhost:5000/admin-me", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((user) => {
				dispatch(currentRepAdded(user));
			});
	}, []);
	useEffect(() => {
		fetch("http://localhost:5000/queries", {
			credentials: "include",
		})
			.then((response) => response.json())
			.then((data) => setQueries(data))
			.catch((error) => console.error(error));
	}, []);
	console.log(queries);
	console.log(currentrep);
	return (
		<div>
			<h2>Customer Queries</h2>

			{queries && queries.length > 0 ? (
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
			{showChatBox && <Chatbox chatId={chatId} currentrep={currentrep} />}
		</div>
	);
}

export default CustomerQueries;
