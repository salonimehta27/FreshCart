import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../socket";
import { addAdminChatMessage } from "./adminChatSlice";

function Chatbox({ chatId, currentrep }) {
	const chatMessages = useSelector((state) => state.adminChat.messages);
	const [messageInput, setMessageInput] = useState("");
	//const currentRep = useSelector((state) => state.currentRep.entities);
	const dispatch = useDispatch();
	function handleIncomingMessage(message) {
		// Handle incoming chat messages
		// Add the new message to the chatMessages state
		//setChatMessages((prevMessages) => [...prevMessages, message]);
		dispatch(addAdminChatMessage(message));
	}
	console.log(currentrep);
	console.log(chatId);
	useEffect(() => {
		// Listen for incoming chat messages
		if (socket) {
			socket.on("customer_rep_message", handleIncomingMessage);
		}

		return () => {
			// Clean up the event listener when the component unmounts
			if (socket) {
				socket.off("customer_rep_message", handleIncomingMessage);
			}
		};
	}, []);

	function handleSendMessage(id) {
		// Send the message via WebSocket
		const newMessage = {
			sender: "Customer_rep",
			message: messageInput,
			customer_rep_id: id,
			chat_id: chatId,
		};

		if (socket) {
			socket.emit("customer_rep_message", newMessage);
		}

		setMessageInput(""); // Clear the message input field
	}

	return (
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
				<button
					onClick={() => handleSendMessage(currentrep.customer_rep_id)}
					disabled={!messageInput}
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default Chatbox;
