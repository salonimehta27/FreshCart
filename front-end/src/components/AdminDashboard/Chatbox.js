import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../socket";
import { addAdminChatMessage, loadAdminChatMessages } from "./adminChatSlice";
import "./AdminDashboard.css";
// import styles from "../AdminDashboard/Chatbox.module.css";

function Chatbox({ chatId, currentrep }) {
	const chatMessages = useSelector((state) => state.adminChat.messages);
	const [messageInput, setMessageInput] = useState("");
	//const currentRep = useSelector((state) => state.currentRep.entities);

	const chatMessagesRef = useRef(null);

	useEffect(() => {
		chatMessagesRef.current.scrollTop =
			chatMessagesRef.current.scrollHeight -
			chatMessagesRef.current.clientHeight;
	}, [chatMessages]);
	const dispatch = useDispatch();
	useEffect(() => {
		// Listen for incoming chat messages

		socket.on("customer_resp", (data) => {
			if (data.sender === "User" && data.roomId === chatId) {
				dispatch(addAdminChatMessage(data));
			}
		});

		return () => {
			// Clean up the event listener when the component unmounts
			if (socket) {
				socket.off("customer_resp");
			}
		};
	}, []);

	function handleSendMessage(id) {
		// Send the message via WebSocket
		if (messageInput !== "") {
			const newMessage = {
				sender: "Customer_rep",
				message: messageInput,
				customer_rep_id: id,
				chat_id: chatId,
			};

			dispatch(
				addAdminChatMessage({ sender: "Customer_rep", message: messageInput })
			);
			if (socket) {
				socket.emit("customer_rep_message", newMessage);
			}

			setMessageInput(""); // Clear the message input field
		}
	}

	return (
		<div className="chat-box">
			<div className="chat-messages" ref={chatMessagesRef}>
				{chatMessages.map((message, index) => (
					<div
						key={index}
						className={`message ${message.sender.toLowerCase()} ${
							message.sender === "Customer_rep" ? "right" : "left"
						}`}
					>
						<div className="message-bubble">
							{message.sender !== "Customer_rep" && (
								<span className="sender">{message.sender}: </span>
							)}
							<span className="content">{message.message}</span>
						</div>
					</div>
				))}
			</div>
			<div className="chat-input">
				<input
					type="text"
					placeholder="Type your message..."
					value={messageInput}
					style={{ width: "100%" }}
					onChange={(e) => setMessageInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault(); // Prevents the default Enter key behavior
							handleSendMessage(currentrep.customer_rep_id);
						}
					}}
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
