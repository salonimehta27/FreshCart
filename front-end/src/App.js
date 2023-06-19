import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/CustomerSide/features/navbar/Navbar";
import AdminNavbar from "./components/AdminDashboard/AdminNavbar";
import Home from "./components/CustomerSide/Home";
import Product from "./components/CustomerSide/features/product/Product";
import ProductDetails from "./components/CustomerSide/features/product/ProductDetails";
import SignupForm from "./components/CustomerSide/features/account/SignupForm";
import LoginForm from "./components/CustomerSide/features/account/LoginForm";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAdded } from "./components/CustomerSide/features/account/loginSlice";
import { currentRepAdded } from "./components/AdminDashboard/AdminSlice";
import Cart from "./components/CustomerSide/features/order & payment/Cart";
import AddressForm from "./components/CustomerSide/features/order & payment/AddressForm";
import PaymentForm from "./components/CustomerSide/features/order & payment/PaymentForm";
import OrderSuccess from "./components/CustomerSide/features/order & payment/OrderSuccess";
import Chatbot from "./components/CustomerSide/features/chat/Chatbot";
import LoginPage from "./components/AdminDashboard/LoginPage";
import CustomerQueries from "./components/AdminDashboard/CustomerQueries";
import { loadChatMessages } from "./chatSlice";
import { setChatId } from "./components/AdminDashboard/adminChatSlice";
import { setAllOrders } from "./components/CustomerSide/features/order & payment/orderSlice";
import OrdersListPage from "./components/CustomerSide/features/order & payment/OrdersListPage";
import "./App.css";
import Editprofile from "./components/CustomerSide/features/account/Editprofile";

function App() {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.currentUser.entities);
	const cartItems = useSelector((state) => state.carts.items);
	const currentrep = useSelector((state) => state.currentRep.entities);
	const chatLog = useSelector((state) => state.chat.messages);
	const orders = useSelector((state) => state.order.allOrders);
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
			.then((data) => {
				dispatch(setChatId(data.chatId));
				dispatch(loadChatMessages(data.messages));
			});

		fetch("http://localhost:5000/customer/orders", {
			credentials: "include",
		})
			.then((r) => r.json())
			.then((data) => dispatch(setAllOrders(data.orders)));
	}, []);

	const isOnAdminRoute = window.location.pathname.startsWith("/admin");

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
					<Route path="/all-products" element={<Product />} />
					<Route path="/orders" element={<OrdersListPage orders={orders} />} />
					{currentUser !== null && (
						<Route
							path="/edit-profile"
							element={<Editprofile currentUser={currentUser} />}
						/>
					)}
				</Routes>
				{currentUser !== null &&
					currentUser !== undefined &&
					!currentUser.error && <Chatbot />}
			</div>
		</Router>
	);
}

export default App;
