import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import AdminHome from "./AdminHome";
import CustomerQueries from "./CustomerQueries";
import DriversList from "./DriversList";
import LoginPage from "./LoginPage";

function AdminDashboard() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	if (!isLoggedIn) {
		return <LoginPage onLogin={handleLogin} />;
	}

	return (
		<Router>
			<AdminNavbar onLogout={handleLogout} />
			<Routes>
				<Route exact path="/" component={AdminHome} />
				<Route path="/queries" component={CustomerQueries} />
				<Route path="/drivers" component={DriversList} />
			</Routes>
		</Router>
	);
}

export default AdminDashboard;
