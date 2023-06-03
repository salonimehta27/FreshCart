import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css";
import { currentRepRemoved } from "./AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
	const [isMenuOpen, setMenuOpen] = useState(false);
	const currentrep = useSelector((state) => state.currentRep.entities);
	const dispatch = useDispatch();
	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};
	const navigate = useNavigate();

	const handleLogout = () => {
		fetch("http://localhost:5000/admin-logout")
			.then((r) => r.json())
			.then(() => {
				dispatch(currentRepRemoved());
				navigate("/admin");
			});
	};

	return (
		<nav className="admin-navbar">
			<div className="admin-navbar__toggle" onClick={toggleMenu}>
				<div className={`admin-navbar__icon ${isMenuOpen ? "open" : ""}`}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<ul className={`admin-navbar__list ${isMenuOpen ? "open" : ""}`}>
				<li className="admin-navbar__item">
					<Link to="/admin" className="admin-navbar__link">
						Home
					</Link>
				</li>
				<li className="admin-navbar__item">
					<Link to="/admin-queries" className="admin-navbar__link">
						Customer Queries
					</Link>
				</li>
				<li className="admin-navbar__item">
					<Link to="/drivers" className="admin-navbar__link">
						Drivers List
					</Link>
				</li>
				{currentrep && (
					<li className="admin-navbar__item">
						<button onClick={handleLogout} className="admin-navbar__button">
							Logout
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
}

export default AdminNavbar;
