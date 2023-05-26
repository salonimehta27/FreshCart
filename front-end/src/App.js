import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/CustomerSide/Navbar";
import AdminNavbar from "./components/AdminDashboard/AdminNavbar";
import Home from "./components/CustomerSide/Home";
import Product from "./components/CustomerSide/Product";
import ProductDetails from "./components/CustomerSide/ProductDetails";
import SignupForm from "./components/CustomerSide/SignupForm";
import LoginForm from "./components/CustomerSide/LoginForm";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAdded } from "./components/CustomerSide/loginSlice";
import { currentRepAdded } from "./components/AdminDashboard/AdminSlice";
import Cart from "./components/CustomerSide/Cart";
import Container from "react-bootstrap/Container";
import AddressForm from "./components/CustomerSide/AddressForm";
import PaymentForm from "./components/CustomerSide/PaymentForm";
import OrderSuccess from "./components/CustomerSide/OrderSuccess";
import Chatbot from "./components/CustomerSide/Chatbot";
import LoginPage from "./components/AdminDashboard/LoginPage";
import CustomerQueries from "./components/AdminDashboard/CustomerQueries";
import { loadChatMessages, addChatMessage } from "./chatSlice";
import AdminChatbot from "./components/AdminDashboard/AdminChatbot";

function App() {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.currentUser.entities);
	const cartItems = useSelector((state) => state.carts.items);
	const currentrep = useSelector((state) => state.currentRep.entities);
	//const [chatLog, setChatLog] = useState([]);
	const chatLog = useSelector((state) => state.chat.messages);
	//console.log(currentUser);
	useEffect(() => {
		fetch("http://localhost:5000/me", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((user) => dispatch(currentUserAdded(user)));
		fetch("http://localhost:5000/admin-me", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((user) => dispatch(currentRepAdded(user)));

		fetch("http://localhost:5000/get_chat", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => dispatch(loadChatMessages(data)));
	}, []);

	const isOnAdminRoute = window.location.pathname.startsWith("/admin");
	console.log(currentrep);

	return (
		<Router>
			<div className="App">
				{isOnAdminRoute ? (
					<AdminNavbar current_rep={currentrep} />
				) : (
					<Navbar currentUser={currentUser} />
				)}
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/products" element={<Product />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route exact path="/signup" element={<SignupForm />} />
					<Route exact path="/login" element={<LoginForm />} />
					<Route path="/cart" element={<Cart cart={cartItems} />} />
					<Route path="/shipping" element={<AddressForm />} />
					<Route
						path="/payment"
						element={<PaymentForm cartItems={cartItems.cart_products} />}
					/>
					<Route path="/order_success" element={<OrderSuccess />} />
					<Route
						path="/admin/*"
						element={<AdminDashboard current_rep={currentrep} />}
					/>
					<Route path="/admin-login" element={<LoginPage />} />
					<Route path="/admin-queries" element={<CustomerQueries />} />
				</Routes>
				{currentUser !== null &&
					currentUser !== undefined &&
					!currentUser.error && <Chatbot />}

				{/* {currentrep !== null && currentrep !== undefined && <AdminChatbot />} */}
			</div>
		</Router>
	);
}

export default App;
