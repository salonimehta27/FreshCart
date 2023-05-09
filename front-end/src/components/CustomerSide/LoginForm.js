import React, { useState } from "react";
import { Link } from "react-router-dom";
function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		// TODO: Add login logic here
	};

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
