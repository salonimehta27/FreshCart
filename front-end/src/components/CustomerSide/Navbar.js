import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ handleSearch }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		handleSearch(event.target.value, categoryFilter);
	};

	const handleCategoryFilterChange = (event) => {
		setCategoryFilter(event.target.value);
		handleSearch(searchQuery, event.target.value);
	};

	return (
		<nav>
			<Link to="/">Home</Link>
			<form>
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
			</form>
			<Link to="/cart">Cart</Link>
			<br></br>
			<Link to="/login">Login/Signup</Link>
		</nav>
	);
}

export default Navbar;
