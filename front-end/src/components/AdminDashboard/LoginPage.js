import React, { useState } from "react";

function LoginPage({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Perform authentication logic here, then call onLogin with user object
		const user = { username };
		onLogin(user);
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Username:
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
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
