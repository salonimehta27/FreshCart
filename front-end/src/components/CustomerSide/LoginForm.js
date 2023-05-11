import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { currentUserAdded } from "./loginSlice";
function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const currentUser = useSelector((state) => state.currentUser.entities);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();

		fetch("http://localhost:5000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(currentUserAdded(data));
				setEmail("");
				setPassword("");
			});
		navigate("/");
	};
	// console.log(currentUser);
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<label>
					Email:
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
				<br />
				<button type="submit">Log In</button>
			</form>
			<p>
				Don't have an account? <Link to="/signup">Sign up</Link> now.
			</p>
		</div>
	);
}

export default LoginForm;
