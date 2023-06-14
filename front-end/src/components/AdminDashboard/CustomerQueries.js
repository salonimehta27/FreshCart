import React, { useState, useEffect, useRef, useCallback } from "react";
import CustomerQueryItem from "./CustomerQueryItem";
import Chatbox from "./Chatbox";
import { currentRepAdded } from "./AdminSlice";
import socket from "../../socket";
import { addQuery, setQueries } from "./querySlice";
import "./queries.css";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import empty from "../CustomerSide/images/empty.jpg";

function CustomerQueries() {
	const queries = useSelector((state) => state.query);
	// const [queries, setQueries] = useState([]);
	const currentrep = useSelector((state) => state.currentRep.entities);
	const [showChatBox, setShowChatBox] = useState(false);
	// const chatId = useSelector((state) => state.adminChat.chat_id);
	const [chatId, setChatId] = useState();
	const [showModal, setShowModal] = useState(false);
	const [currentQuery, setCurrentQuery] = useState(null);
	const dispatch = useDispatch();
	function handleClick(chatId) {
		// Update the showChatBox state
		console.log(chatId);
		setShowChatBox(true);
		setChatId(chatId);
		setShowModal(true);
		// Rest of your code
	}
	console.log(queries);
	const handleCloseModal = () => {
		setShowModal(false);
		setChatId(null);
		dispatch(() => {
			setQueries((prevQueries) => {
				const updatedQueries = prevQueries.filter((q) => q.id !== currentQuery);
				return updatedQueries;
			});
		});
	};
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
			<h2 style={{ textAlign: "center", marginTop: "20px" }}>Tickets</h2>

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
						handleCurrentQuery={setCurrentQuery}
					/>
				))
			) : (
				<>
					<div className="container">
						<div class="alert alert-primary" role="alert">
							No tickets at the moment
						</div>
						{/* <h4 style={{ textAlign: "center", marginTop: "30px" }}>
							No tickets at the moment
						</h4> */}

						<img
							src={empty}
							className="fluid"
							style={{ maxWidth: "100%", height: "auto" }}
							alt="empty"
						></img>
					</div>
				</>
			)}
			{showModal && (
				<Modal
					show={showModal}
					onHide={handleCloseModal}
					style={{ height: "100vh", marginTop: "50px" }}
				>
					<Modal.Header closeButton>
						<Modal.Title>Customer Service</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Chatbox chatId={chatId} currentrep={currentrep} />
					</Modal.Body>
					<Modal.Footer>
						<button onClick={handleCloseModal}>Close</button>
					</Modal.Footer>
				</Modal>
			)}
		</div>
	);
}

export default CustomerQueries;
