import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productFiltered } from "./productsSlice";
import { currentUserAdded, currentUserRemoved } from "./loginSlice";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function CustomNavbar({ currentUser }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSearch = (searchQuery, categoryFilter) => {
		dispatch(productFiltered({ searchQuery, categoryFilter }));
	};

	const handleLogout = () => {
		fetch("http://localhost:5000/logout", { credentials: "include" })
			.then((r) => r.json())
			.then(() => {
				dispatch(currentUserRemoved());
			});
		navigate("/");
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		handleSearch(event.target.value, categoryFilter);
	};

	const handleCategoryFilterChange = (event) => {
		setCategoryFilter(event.target.value);
		handleSearch(searchQuery, event.target.value);
	};

	return (
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand style={{ color: "white" }} href="/">
					FreshCart
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/cart">Cart</Nav.Link>
						{currentUser && !currentUser.error ? (
							<a
								href="/"
								onClick={handleLogout}
								style={{ color: "white" }}
								className="nav-link"
							>
								Logout
							</a>
						) : (
							<Nav.Link href="/login">Login/Signup</Nav.Link>
						)}
						<NavDropdown title="Categories" id="basic-nav-dropdown">
							<NavDropdown.Item
								onClick={() =>
									handleCategoryFilterChange({ target: { value: "all" } })
								}
							>
								All
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item
								onClick={() =>
									handleCategoryFilterChange({ target: { value: "category1" } })
								}
							>
								Category 1
							</NavDropdown.Item>
							<NavDropdown.Item
								onClick={() =>
									handleCategoryFilterChange({ target: { value: "category2" } })
								}
							>
								Category 2
							</NavDropdown.Item>
							<NavDropdown.Item
								onClick={() =>
									handleCategoryFilterChange({ target: { value: "category3" } })
								}
							>
								Category 3
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Form className="d-flex">
						<Form.Control
							type="text"
							placeholder="Search"
							className="mr-sm-2"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						<Button
							variant="light"
							onClick={() => handleSearch(searchQuery, categoryFilter)}
						>
							Submit
						</Button>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default CustomNavbar;
