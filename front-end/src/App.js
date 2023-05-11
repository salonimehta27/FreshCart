import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/CustomerSide/Navbar";
import Home from "./components/CustomerSide/Home";
import Product from "./components/CustomerSide/Product";
import ProductDetails from "./components/CustomerSide/ProductDetails";
import SignupForm from "./components/CustomerSide/SignupForm";
import LoginForm from "./components/CustomerSide/LoginForm";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAdded } from "./components/CustomerSide/loginSlice";

function App() {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.currentUser.entities);
	useEffect(() => {
		fetch("http://localhost:5000/me", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((user) => {
				dispatch(currentUserAdded(user));
			});
	}, []);
	return (
		<Router>
			<div className="App">
				<Navbar currentUser={currentUser} />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/products" element={<Product />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route exact path="/signup" element={<SignupForm />} />
					<Route exact path="/login" element={<LoginForm />} />
					<Route path="/admin" element={<AdminDashboard />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
