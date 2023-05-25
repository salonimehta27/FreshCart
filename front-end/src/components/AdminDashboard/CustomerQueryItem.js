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
	const [messageInput, setMessageInput] = useState("");
	const [chatMessages, setChatMessages] = useState([]);

	// useEffect(() => {
	// 	// Initialize the Socket.IO client connection

	// 	return () => {
	// 		// Clean up the socket connection when the component unmounts
	// 		socket.disconnect();
	// 	};
	// }, []);

	useEffect(() => {
		// Listen for incoming chat messages
		if (socket) {
			socket.on("chat_message", handleIncomingMessage);
		}

		return () => {
			// Clean up the event listener when the component unmounts
			if (socket) {
				socket.off("chat_message", handleIncomingMessage);
			}
		};
	}, [socket]);

	function handleIncomingMessage(message) {
		setChatMessages((prevMessages) => [...prevMessages, message]);
	}
	function handleClick(id) {
		console.log(currentRep);
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
				setChatMessages(data.messages);
				handleShowClick(true);
				console.log(showChatBox);
			});
	}

	// function handleClick(id) {
	// 	console.log(currentRep);

	// 	const acceptQueryRequest = fetch(
	// 		`http://localhost:5000/accept-query/${id}`,
	// 		{
	// 			method: "PATCH",
	// 			credentials: "include",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				is_accepted: true,
	// 				customer_rep_id: currentRep.customer_rep_id,
	// 			}),
	// 		}
	// 	).then((r) => r.json());

	// 	const getChatMessagesRequest = fetch(
	// 		`http://localhost:5000/get_chat_messages/${id}`,
	// 		{
	// 			credentials: "include",
	// 		}
	// 	).then((r) => r.json());

	// 	Promise.all([acceptQueryRequest, getChatMessagesRequest]).then(
	// 		([acceptQueryData, chatMessagesData]) => {
	// 			setQueries((prevQueries) => {
	// 				const updatedQueries = prevQueries.filter(
	// 					(q) => q.id !== acceptQueryData.id
	// 				);
	// 				return updatedQueries;
	// 			});
	// 			setShowChatBox(true);
	// 			dispatch(loadAdminChatMessages(chatMessagesData));
	// 			setChatMessages(chatMessagesData);
	// 		}
	// 	);
	// }

	function handleSendMessage() {
		// Send the message via websocket

		const newMessage = {
			sender: "Customer_rep",
			message: messageInput,
		};

		if (socket) {
			socket.emit("send_chat_message", newMessage);
		}

		setMessageInput(""); // Clear the message input field
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
				{showChatBox && (
					<div className="chat-box">
						<div className="chat-messages">
							{chatMessages.map((message, index) => (
								<div
									key={index}
									className={`message ${message.sender.toLowerCase()} ${
										message.sender === "Customer_rep" ? "right" : "left"
									}`}
								>
									<span className="sender">{message.sender}: </span>
									<span className="content">{message.message}</span>
								</div>
							))}
						</div>
						<div className="chat-input">
							<input
								type="text"
								placeholder="Type your message..."
								value={messageInput}
								onChange={(e) => setMessageInput(e.target.value)}
							/>
							<button onClick={handleSendMessage} disabled={!messageInput}>
								Send
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default CustomerQueryItem;
