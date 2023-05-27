import io from "socket.io-client";

const socket = io("http://localhost:5000", {
	withCredentials: true, // Include session cookie in the WebSocket connection
});

export default socket;
