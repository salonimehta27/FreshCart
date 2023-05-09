import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleCategoryFilterChange = (event) => {
		setCategoryFilter(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Search query:", searchQuery);
		console.log("Category filter:", categoryFilter);
	};

	return (
		<nav>
			<Link to="/">Home</Link>
			<form onSubmit={handleSubmit}>
				<label>
					Search:
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</label>
				<label>
					Filter by category:
					<select value={categoryFilter} onChange={handleCategoryFilterChange}>
						<option value="all">All</option>
						<option value="category1">category1</option>
						<option value="category2">category2</option>
						<option value="category3">category3</option>
					</select>
				</label>
				<button type="submit">Submit</button>
			</form>
			{/* <Link to="/cart">Cart</Link> */}
		</nav>
	);
}
export default Navbar;
