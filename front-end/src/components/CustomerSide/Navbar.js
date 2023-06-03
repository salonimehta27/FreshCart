import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productFiltered } from "./productsSlice";
import { currentUserAdded, currentUserRemoved } from "./loginSlice";
import Navbar from "react-bootstrap/Navbar";
import Badge from "@material-ui/core/Badge";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { FaClipboardList } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import "./navbar.css";
import grocery from "../CustomerSide/images/grocery.png";
import { useLocation } from "react-router-dom";
import logo1 from "../CustomerSide/images/logo1.png";

function CustomNavbar({ currentUser, setShopNow, shopNow }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cartData = useSelector((state) => state.carts.items);
	const location = useLocation();
	const isProductsPage = location.pathname === "/all-products";

	const handleSearch = (searchQuery, categoryFilter) => {
		dispatch(productFiltered({ searchQuery, categoryFilter }));
	};

	const handleLogout = () => {
		fetch("http://localhost:5000/logout", { credentials: "include" })
			.then((r) => r.json())
			.then(() => {
				dispatch(currentUserRemoved());
				localStorage.removeItem("order");
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
		<Navbar variant="dark" expand="lg" style={{ backgroundColor: "#0B614A" }}>
			<Container>
				<Navbar.Brand style={{ color: "white" }} href="/">
					<img src={logo1} alt="logo" style={{ height: "50px" }}></img>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
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
							<Nav.Link href="/login">Login</Nav.Link>
						)}
						{isProductsPage && (
							<NavDropdown title="Shop by Brand" id="basic-nav-dropdown">
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
										handleCategoryFilterChange({
											target: { value: "Cadbury" },
										})
									}
								>
									Cadbury
								</NavDropdown.Item>
								<NavDropdown.Item
									onClick={() =>
										handleCategoryFilterChange({
											target: { value: "Kool-Aid" },
										})
									}
								>
									Kool-Aid
								</NavDropdown.Item>
								<NavDropdown.Item
									onClick={() =>
										handleCategoryFilterChange({
											target: { value: "Ferrero" },
										})
									}
								>
									Ferrero
								</NavDropdown.Item>
								<NavDropdown.Item
									onClick={() =>
										handleCategoryFilterChange({
											target: { value: "Greenfield" },
										})
									}
								>
									Greenfield
								</NavDropdown.Item>
							</NavDropdown>
						)}
					</Nav>
					{isProductsPage && (
						<Form className="d-flex">
							<div className="search-container">
								<input
									type="text"
									placeholder="Search"
									className="mr-sm-2"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
							</div>
						</Form>
					)}
					<Nav className="d-flex">
						<Nav.Link href="/cart" eventKey={2} className="justify-content-end">
							<Badge
								color="secondary"
								overlap="rectangular"
								badgeContent={
									cartData && cartData.cart_products
										? cartData.cart_products.length
										: null
								}
							>
								<ShoppingCartIcon style={{ color: "white" }} />
							</Badge>
						</Nav.Link>
					</Nav>

					{currentUser && !currentUser.error && (
						<Nav className="d-flex">
							<Nav.Link href="/orders">
								<FaClipboardList
									size={24}
									style={{ color: "white", marginLeft: "5px" }}
								/>
							</Nav.Link>
						</Nav>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default CustomNavbar;
