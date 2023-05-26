import React, { useState, useEffect } from "react";
import "./chatbot.css";
import { useSelector, useDispatch } from "react-redux";
import { loadChatMessages, addChatMessage } from "../../chatSlice";
import socket from "../../socket";
import { setChatId } from "../AdminDashboard/adminChatSlice";

const Chatbot = () => {
	const [isChatOpen, setChatOpen] = useState(false);
	const [message, setMessage] = useState("");
	const currentUser = useSelector((state) => state.currentUser.entities);
	const chatLog = useSelector((state) => state.chat.messages);
	const dispatch = useDispatch();

	useEffect(() => {
		socket.on("customer_rep_message", (data) => {
			const { sender, message } = data;
			dispatch(addChatMessage(sender, message));
		});

		return () => {
			socket.off("customer_rep_message");
		};
	}, []);

	const toggleChat = () => {
		setChatOpen(!isChatOpen);
	};

	const sendMessage = () => {
		// console.log(message);
		if (message.trim() !== "") {
			socket.emit("message", { sender: "User", message });

			fetch(`http://localhost:5000/api/chat/${currentUser.customer_id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_input: message }),
				credentials: "include",
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					dispatch(loadChatMessages(data.chat_messages));
					dispatch(setChatId(data.chat_id));
				})
				.catch((error) => {
					console.error(error);
				});

			// 		setMessage("");
			setMessage("");
		}
	};

	const handleInputChange = (event) => {
		setMessage(event.target.value);
	};

	return (
		<div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
			<div className="chatbot-header" onClick={toggleChat}>
				Chat
			</div>
			{isChatOpen && (
				<div className="chatbot-window">
					<div className="chat-log">
						{chatLog &&
							chatLog.map((entry, index) => (
								<div
									key={index}
									className={`chat-entry ${
										entry.sender === "User" ? "user" : "bot"
									}`}
								>
									<div className="message-bubble">
										<p className="message-text">{entry.message}</p>
									</div>
								</div>
							))}
					</div>
					<div className="chat-input">
						<input
							type="text"
							value={message}
							onChange={handleInputChange}
							placeholder="Type your message..."
							className="input-field"
						/>
						<button onClick={sendMessage}>Send</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
