import React, { useState } from "react";
import "./chatbot.css";
import axios from "axios";
import { useSelector } from "react-redux";

const Chatbot = () => {
	const [isChatOpen, setChatOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [chatLog, setChatLog] = useState([]);
	const currentUser = useSelector((state) => state.currentUser.entities);

	console.log(currentUser);
	const toggleChat = () => {
		setChatOpen(!isChatOpen);
	};

	// const sendMessage = () => {
	// 	if (message.trim() !== "") {
	// 		setChatLog([...chatLog, { user: true, text: message }]);
	// 		axios
	// 			.post(`http://localhost:5000/api/chat/${currentUser.customer_id}`, {
	// 				user_input: message,
	// 			})
	// 			.then((response) => {
	// 				const botResponse = response.data.response;
	// 				setChatLog([...chatLog, { user: false, text: botResponse }]);
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 		setMessage("");
	// 	}
	// };
	const sendMessage = () => {
		if (message.trim() !== "") {
			const userMessage = { user: true, text: message };
			setChatLog([...chatLog, userMessage]);

			fetch(`http://localhost:5000/api/chat/${currentUser.customer_id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_input: message }),
			})
				.then((response) => response.json())
				.then((data) => {
					const botResponse = data.response;
					setChatLog([
						...chatLog,
						userMessage,
						{ user: false, text: botResponse },
					]);
				})
				.catch((error) => {
					console.error(error);
				});

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
						{chatLog.map((entry, index) => (
							<div
								key={index}
								className={`chat-entry ${entry.user ? "user" : "bot"}`}
							>
								<div className="message-bubble">
									<p className="message-text">{entry.text}</p>
									{/* <p className="message-timestamp">Timestamp goes here</p> */}
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
