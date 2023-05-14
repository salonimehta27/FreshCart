import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
function SignupForm() {
	const [formData, setFormData] = useState({
		fname: "",
		lname: "",
		username: "",
		email: "",
		password: "",
		role: "customer",
	});
	const navigate = useNavigate();
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetch("http://localhost:5000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				setFormData({
					fname: "",
					lname: "",
					username: "",
					email: "",
					password: "",
					role: "customer",
				});
				navigate("/login");
			})
			.catch((error) => console.error(error));
	};

	return (
		<Container>
			<Form onSubmit={handleSubmit}>
				<h1>Sign up</h1>
				<Form.Group controlId="formBasicFirstName">
					<Form.Label>First Name:</Form.Label>
					<Form.Control
						type="text"
						name="fname"
						value={formData.fname}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicLastName">
					<Form.Label>Last Name:</Form.Label>
					<Form.Control
						type="text"
						name="lname"
						value={formData.lname}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicUsername">
					<Form.Label>Username:</Form.Label>
					<Form.Control
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email:</Form.Label>
					<Form.Control
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password:</Form.Label>
					<Form.Control
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Button variant="primary" type="submit">
					Sign Up
				</Button>
			</Form>
		</Container>
	);
}

export default SignupForm;
