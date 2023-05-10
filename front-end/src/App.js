import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/CustomerSide/Navbar";
import Home from "./components/CustomerSide/Home";
import Product from "./components/CustomerSide/Product";
import ProductDetails from "./components/CustomerSide/ProductDetails";
import SignupForm from "./components/CustomerSide/SignupForm";
import LoginForm from "./components/CustomerSide/LoginForm";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
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
