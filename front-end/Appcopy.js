// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/CustomerSide/Navbar";
// import Home from "./components/CustomerSide/Home";
// import Product from "./components/CustomerSide/Product";
// import ProductDetails from "./components/CustomerSide/ProductDetails";
// import SignupForm from "./components/CustomerSide/SignupForm";
// import LoginForm from "./components/CustomerSide/LoginForm";
// import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
// import { useDispatch, useSelector } from "react-redux";
// import { currentUserAdded } from "./components/CustomerSide/loginSlice";
// import {
// 	cartItemsAdded,
// 	cartItemsCleared,
// } from "./components/CustomerSide/cartsSlice";
// import Cart from "./components/CustomerSide/Cart";
// import Container from "react-bootstrap/Container";
// import AddressForm from "./components/CustomerSide/AddressForm";
// import PaymentForm from "./components/CustomerSide/PaymentForm";
// import OrderSuccess from "./components/CustomerSide/OrderSuccess";
// import Chatbot from "./components/CustomerSide/Chatbot";
// function App() {
// 	const dispatch = useDispatch();
// 	const currentUser = useSelector((state) => state.currentUser.entities);
// 	const cartItems = useSelector((state) => state.carts.items);
// 	useEffect(() => {
// 		fetch("http://localhost:5000/me", {
// 			credentials: "include",
// 		})
// 			.then((res) => res.json())
// 			.then((user) => {
// 				dispatch(currentUserAdded(user));
// 			});
// 	}, []);
// 	// console.log(cartItems);
// 	return (
// 		<Router>
// 			<div className="App">
// 				<Navbar currentUser={currentUser} />
// 				<Routes>
// 					<Route exact path="/" element={<Home />} />
// 					<Route path="/products" element={<Product />} />
// 					<Route path="/products/:id" element={<ProductDetails />} />
// 					<Route exact path="/signup" element={<SignupForm />} />
// 					<Route exact path="/login" element={<LoginForm />} />
// 					<Route path="/admin" element={<AdminDashboard />} />
// 					<Route exact path="/cart" element={<Cart cart={cartItems} />} />
// 					<Route exact path="/shipping" element={<AddressForm />} />
// 					<Route
// 						path="/payment"
// 						element={<PaymentForm cartItems={cartItems.cart_products} />}
// 					/>
// 					<Route path="/order_success" element={<OrderSuccess />} />
// 				</Routes>
// 				<Chatbot />
// 			</div>
// 		</Router>
// 	);
// }

// export default App;
