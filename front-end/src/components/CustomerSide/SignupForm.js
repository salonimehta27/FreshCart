import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
		<form onSubmit={handleSubmit}>
			<h1>Sign up</h1>
			<label>
				First Name:
				<input
					type="text"
					name="fname"
					value={formData.fname}
					onChange={handleChange}
					required
				/>
			</label>
			<label>
				Last Name:
				<input
					type="text"
					name="lname"
					value={formData.lname}
					onChange={handleChange}
					required
				/>
			</label>
			<label>
				Username:
				<input
					type="text"
					name="username"
					value={formData.username}
					onChange={handleChange}
					required
				/>
			</label>
			<label>
				Email:
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
			</label>
			<label>
				Password:
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
			</label>
			<button type="submit">Sign Up</button>
		</form>
	);
}

export default SignupForm;
