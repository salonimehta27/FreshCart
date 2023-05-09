import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/CustomerSide/Navbar";
import Home from "./components/CustomerSide/Home";
import Product from "./components/CustomerSide/Product";
import ProductDetails from "./components/CustomerSide/ProductDetails";
import SignupForm from "./components/CustomerSide/SignupForm";
import LoginForm from "./components/CustomerSide/LoginForm";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/products")
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				setFilteredProducts(data);
			})
			.catch((error) => console.error(error));
	}, []);

	const handleSearch = (searchQuery, categoryFilter) => {
		// debugger;
		let newFilteredProducts = products.filter((product) => {
			const matchedCategory =
				categoryFilter === "all" || product.category === categoryFilter;
			const matchedSearch = product.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			return matchedCategory && matchedSearch;
		});
		setFilteredProducts(newFilteredProducts);
	};

	return (
		<Router>
			<div className="App">
				<Navbar handleSearch={handleSearch} />
				<Routes>
					<Route
						exact
						path="/"
						element={<Home products={filteredProducts} />}
					/>
					<Route
						path="/products"
						element={<Product products={filteredProducts} />}
					/>
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
