import React, { useState } from "react";
import { currentRepAdded } from "./AdminSlice";
import { useDispatch } from "react-redux";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			email: email,
			password: password,
		};

		fetch("http://localhost:5000/admin-login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				// Handle the response data here
				console.log(data);
				dispatch(currentRepAdded(data));
			})
			.catch((error) => {
				// Handle any errors here
				console.error(error);
			});
		setEmail("");
		setPassword("");
		// Perform authentication logic here, then call onLogin with user object
		// const user = { username };
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<button type="submit">Login</button>
			</form>
		</div>
	);
}

export default LoginPage;
