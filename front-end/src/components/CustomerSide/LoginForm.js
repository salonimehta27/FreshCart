import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { currentUserAdded } from "./loginSlice";
import { Container, Form, Button } from "react-bootstrap";
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
				navigate("/");
			});
	};
	// console.log(currentUser);

	return (
		<Container>
			<Form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email:</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						onChange={(event) => setEmail(event.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password:</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						onChange={(event) => setPassword(event.target.value)}
					/>
				</Form.Group>

				<Button variant="primary" type="submit">
					Log In
				</Button>
			</Form>
			<p>
				Don't have an account? <Link to="/signup">Sign up</Link> now.
			</p>
		</Container>
	);
}

export default LoginForm;
