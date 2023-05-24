import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminHome from "./AdminHome";
import CustomerQueries from "./CustomerQueries";
import DriversList from "./DriversList";
import LoginPage from "./LoginPage";

function AdminDashboard({ current_rep }) {
	// const [isLoggedIn, setIsLoggedIn] = useState(false);

	// const handleLogin = () => {
	// 	setIsLoggedIn(true);
	// };

	// const handleLogout = () => {
	// 	setIsLoggedIn(false);
	// };

	if (current_rep === undefined || !current_rep) {
		return <LoginPage />;
	}

	return (
		<>
			<p>hello</p>
		</>
		// <Router>

		// 	<Routes>
		// 		<Route exact path="/" component={AdminHome} />
		// 		<Route path="/queries" component={CustomerQueries} />
		// 		<Route path="/drivers" component={DriversList} />
		// 	</Routes>
		// </Router>
	);
}

export default AdminDashboard;
