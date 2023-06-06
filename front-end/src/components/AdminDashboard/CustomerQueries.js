import React, { useState, useEffect, useRef, useCallback } from "react";
import CustomerQueryItem from "./CustomerQueryItem";
import Chatbox from "./Chatbox";
import { currentRepAdded } from "./AdminSlice";
import socket from "../../socket";
import { addQuery, setQueries } from "./querySlice";

import { useSelector, useDispatch } from "react-redux";
function CustomerQueries() {
	const queries = useSelector((state) => state.query);
	// const [queries, setQueries] = useState([]);
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
		socket.on("customer query", (data) => {
			dispatch(addQuery(data.query));
		});

		return () => {
			// Clean up the event listener when the component unmounts
			if (socket) {
				socket.off("customer query");
			}
		};
	}, [dispatch]);
	console.log(queries);
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
			.then((data) => {
				console.log(data);
				dispatch(setQueries(data));
			})
			.catch((error) => console.error(error));
	}, []);
	// console.log(queries);
	// console.log(currentrep);
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
				<>{/* <h4>No queries at the moment</h4> */}</>
			)}
			{showChatBox && <Chatbox chatId={chatId} currentrep={currentrep} />}
		</div>
	);
}

export default CustomerQueries;
