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
	const [customerRepActive, setCustomerRepActive] = useState(false);
	const [roomId, setRoomId] = useState(null);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	socket.on("customer_rep_response", (data) => {
	// 		console.log(data);
	// 		dispatch(addChatMessage(data));
	// 	});

	// 	return () => {
	// 		// Clean up the event listener when the component unmounts
	// 		if (socket) {
	// 			socket.off("customer_rep_response");
	// 		}
	// 	};
	// }, []);
	useEffect(() => {
		socket.on("customer_rep_response", (data) => {
			const currentChatId = roomId;
			if (data.sender === "Customer_rep" && data.roomId === currentChatId) {
				dispatch(addChatMessage(data));
			}
		});

		return () => {
			if (socket) {
				socket.off("customer_rep_response");
			}
		};
	}, []);

	useEffect(() => {
		socket.on("chatbot_response", (data) => {
			dispatch(addChatMessage(data));
			// Handle the response as needed
		});

		return () => {
			// Clean up the event listener when the component unmounts
			if (socket) {
				socket.off("chatbot_response");
			}
		};
	}, []);

	const toggleChat = () => {
		setChatOpen(!isChatOpen);
	};

	const sendMessage = () => {
		if (message.trim() !== "") {
			if (customerRepActive) {
				const payload = {
					sender: "User",
					message: message,
					roomId: roomId, // Include the roomId in the payload
					customerId: currentUser.customer_id,
				};
				dispatch(addChatMessage({ sender: "User", message: message }));
				socket.emit("customer_response", payload);
				setMessage("");
			} else {
				if (message.toLowerCase().includes("representative")) {
					dispatch(addChatMessage({ sender: "User", message: message }));
					setCustomerRepActive(true);
					fetch(`http://localhost:5000/post_query/${currentUser.customer_id}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ user_input: message }),
						credentials: "include",
					})
						.then((response) => response.json())
						.then((data) => {
							//console.log(data);
							dispatch(addChatMessage(data.message));
							// dispatch(loadChatMessages(data.chat_messages));
							dispatch(setChatId(data.chatId));
							setRoomId(data.chatId);
						})
						.catch((error) => {
							console.error(error);
						});

					// 		setMessage("");
				} else {
					dispatch(addChatMessage({ sender: "User", message: message }));
					socket.emit("user_message", { message }); // Send the message to the chatbot

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
							// dispatch(loadChatMessages(data.chat_messages));
							// dispatch(setChatId(data.chat_id));
						})
						.catch((error) => {
							console.error(error);
						});

					// 		setMessage("");
				}

				setMessage(""); // Clear the message input field
			}
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
