import React from "react";
import { Link } from "react-router-dom";

function AdminNavbar({ onLogout }) {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/queries">Customer Queries</Link>
				</li>
				<li>
					<Link to="/drivers">Drivers List</Link>
				</li>
				<li>
					<button onClick={onLogout}>Logout</button>
				</li>
			</ul>
		</nav>
	);
}

export default AdminNavbar;
