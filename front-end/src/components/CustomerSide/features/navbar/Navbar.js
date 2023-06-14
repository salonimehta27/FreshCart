import React from "react";
import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productFiltered } from "../product/productsSlice";
import { currentUserAdded, currentUserRemoved } from "../account/loginSlice";
import Navbar from "react-bootstrap/Navbar";
import Badge from "@material-ui/core/Badge";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { FaUser, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import "./navbar.css";
import grocery from "../../images/grocery.png";
import { useLocation } from "react-router-dom";
import logo3 from "../../images/logo3.png";
import { MdOutlineManageAccounts } from "react-icons/md";
import { clearChat } from "../../../../chatSlice";

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
				dispatch(clearChat());
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
		<Navbar
			variant="dark"
			expand="lg"
			style={{ backgroundColor: "#0B614A", height: "80px" }}
		>
			<Container>
				<Navbar.Brand style={{ color: "white" }} href="/">
					<img
						src={logo3}
						alt="logo"
						style={{ height: "", width: "100px" }}
					></img>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{isProductsPage && (
							<NavDropdown
								title="Shop by Brand"
								id="basic-nav-dropdown"
								style={{ color: "white", fontSize: "20px" }}
							>
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
						<Form className="d-flex" style={{ marginRight: "10px" }}>
							<div className="search-container">
								<input
									type="text"
									placeholder="Search Products"
									className="mr-sm-2"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
							</div>
						</Form>
					)}
					{currentUser && !currentUser.error && (
						<h5 style={{ color: "white", marginTop: "10px" }}>
							Hello, {currentUser.fname}
						</h5>
					)}
					{currentUser && !currentUser.error ? (
						<NavDropdown
							title={
								<>
									<MdOutlineManageAccounts size={28} />
								</>
							}
							id="basic-nav-dropdown"
							className="custom-dropdown justify-content-end"
							style={{
								color: "white",
								marginLeft: "10px",
								fontSize: "20px",
							}}
						>
							<Nav.Link
								as={NavLink}
								to="/edit-profile"
								className="dropdown-item"
								style={{
									marginLeft: "20px",
									fontSize: "20px",
									width: "80%",
									paddingRight: "0", // Remove right padding to hide the arrow
								}}
							>
								<FaUser style={{ marginRight: "10px" }} /> Account
							</Nav.Link>
							<Nav.Link
								as={NavLink}
								to="/orders"
								className="dropdown-item"
								style={{
									marginLeft: "20px",
									fontSize: "20px",
									width: "80%",
									paddingRight: "0", // Remove right padding to hide the arrow
								}}
							>
								<FaClipboardList style={{ marginRight: "10px" }} /> Orders
							</Nav.Link>
							<Nav.Link
								as={NavLink}
								to="/"
								onClick={handleLogout}
								className="dropdown-item"
								style={{
									marginLeft: "20px",
									fontSize: "20px",
									width: "80%",
									paddingRight: "0", // Remove right padding to hide the arrow
								}}
							>
								<FaSignOutAlt style={{ marginRight: "10px" }} /> Logout
							</Nav.Link>
						</NavDropdown>
					) : (
						<Nav.Link
							as={NavLink}
							to="/login"
							style={{
								color: "white",
							}}
						>
							Login
						</Nav.Link>
					)}

					<Nav className="d-flex">
						<Nav.Link
							href="/cart"
							eventKey={2}
							className="justify-content-end"
							// style={{ marginRight: "20px" }}
						>
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
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default CustomNavbar;
