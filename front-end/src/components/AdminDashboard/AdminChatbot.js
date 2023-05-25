import React, { useState, useEffect } from "react";
// import "../CustomerSide/chatbot.css";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../socket";

const AdminChatbot = () => {
	// const [isChatOpen, setChatOpen] = useState(false);
	// const [message, setMessage] = useState("");
	// const currentUser = useSelector((state) => state.currentUser.entities);
	// const chatLog = useSelector((state) => state.adminChat.messages);
	// const dispatch = useDispatch();
	// // console.log(Chatbot);
	// // useEffect(() => {
	// // 	socket.on("message", (data) => {
	// // 		const { sender, message } = data;
	// // 		if (sender === "Customer_rep") {
	// // 			// Dispatch the addChatMessage action with the received data from the representative
	// // 			dispatch(addChatMessage(sender, message));
	// // 		} else {
	// // 			// Handle other senders (User, Chatbot) as before
	// // 			dispatch(addChatMessage(sender, message));
	// // 		}
	// // 	});
	// // 	return () => {
	// // 		socket.disconnect();
	// // 	};
	// // }, []);
	// // useEffect(() => {
	// // 	socket.on("message", (data) => {
	// // 		// Extract the sender and message from the received data
	// // 		const { sender, message } = data;
	// // 		// Dispatch the addChatMessage action with the received data
	// // 		dispatch(addChatMessage(sender, message));
	// // 	});
	// // 	// Cleanup the socket connection on component unmount
	// // 	return () => {
	// // 		socket.disconnect();
	// // 	};
	// // }, []);
	// const toggleChat = () => {
	// 	setChatOpen(!isChatOpen);
	// };
	// const sendMessage = () => {
	// 	console.log("hmmmm");
	// 	// if (message.trim() !== "") {
	// 	// 	socket.emit("message", { sender: "Customer_rep", message });
	// 	// 	fetch(`http://localhost:5000/api/chat/${currentUser.customer_id}`, {
	// 	// 		method: "POST",
	// 	// 		headers: {
	// 	// 			"Content-Type": "application/json",
	// 	// 		},
	// 	// 		body: JSON.stringify({ user_input: message }),
	// 	// 		credentials: "include",
	// 	// 	})
	// 	// 		.then((response) => response.json())
	// 	// 		.then((data) => {
	// 	// 			console.log(data);
	// 	// 			dispatch(loadChatMessages(data.chat_messages));
	// 	// 		})
	// 	// 		.catch((error) => {
	// 	// 			console.error(error);
	// 	// 		});
	// 	// 	// 		setMessage("");
	// 	// 	setMessage("");
	// 	// }
	// };
	// const handleInputChange = (event) => {
	// 	setMessage(event.target.value);
	// };
	// return (
	// 	<div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
	// 		<div className="chatbot-header" onClick={toggleChat}>
	// 			Chat
	// 		</div>
	// 		{isChatOpen && (
	// 			<div className="chatbot-window">
	// 				<div className="chat-log">
	// 					{chatLog &&
	// 						chatLog.map((entry, index) => (
	// 							<div
	// 								key={index}
	// 								className={`chat-entry ${
	// 									entry.sender === "Customer_rep" ? "user" : "bot"
	// 								}`}
	// 							>
	// 								<div className="message-bubble">
	// 									<p className="message-text">{entry.message}</p>
	// 								</div>
	// 							</div>
	// 						))}
	// 				</div>
	// 				<div className="chat-input">
	// 					<input
	// 						type="text"
	// 						value={message}
	// 						onChange={handleInputChange}
	// 						placeholder="Type your message..."
	// 						className="input-field"
	// 					/>
	// 					<button onClick={sendMessage}>Send</button>
	// 				</div>
	// 			</div>
	// 		)}
	// 	</div>
	// );
};

export default AdminChatbot;
