import React, { useState } from "react";
import "./chatbot.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadChatMessages } from "../../chatSlice";

const Chatbot = () => {
	const [isChatOpen, setChatOpen] = useState(false);
	const [message, setMessage] = useState("");
	const currentUser = useSelector((state) => state.currentUser.entities);
	const chatLog = useSelector((state) => state.chat.messages);
	const dispatch = useDispatch();
	//console.log(currentUser);
	//console.log(chatLog);
	const toggleChat = () => {
		setChatOpen(!isChatOpen);
	};

	useEffect(() => {
		socket.on("message", (data) => {
			const { sender, message } = data;
			dispatch(loadChatMessages([{ sender, message }]));
		});
		// Cleanup the socket connection on component unmount
		return () => {
			socket.disconnect();
		};
	}, []);

	const sendMessage = () => {
		if (message.trim() !== "") {
			socket.emit("message", { sender: "User", message });
			setMessage("");
		}
	};
	// const sendMessage = () => {
	// 	if (message.trim() !== "") {
	// 		fetch(`http://localhost:5000/api/chat/${currentUser.customer_id}`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ user_input: message }),
	// 			credentials: "include",
	// 		})
	// 			.then((response) => response.json())
	// 			.then((data) => {
	// 				console.log(data);
	// 				dispatch(loadChatMessages(data.chat_messages));
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});

	// 		setMessage("");
	// 	}
	// };

	const handleInputChange = (event) => {
		setMessage(event.target.value);
	};

	console.log(chatLog);
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
										entry[0] === "User" ? "user" : "bot"
									}`}
								>
									<div className="message-bubble">
										<p className="message-text">{entry[1]}</p>
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
