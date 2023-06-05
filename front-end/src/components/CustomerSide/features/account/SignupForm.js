import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import banner6 from "../../images/banner6.png";
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
		<section
			className="vh-100 bg-image"
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${banner6})`,
				backgroundSize: "cover",
			}}
		>
			<div className="mask d-flex align-items-center h-100 gradient-custom-3">
				<div className="container h-100">
					<div className="row d-flex justify-content-center align-items-center h-100">
						<div className="col-12 col-md-9 col-lg-7 col-xl-6">
							<div className="card" style={{ borderRadius: "15px" }}>
								<div className="card-body p-5">
									<h2 className="text-uppercase text-center mb-5">Sign up</h2>

									<Container>
										<Form onSubmit={handleSubmit}>
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

											<Button
												variant="success"
												type="submit"
												className="btn-lg gradient-custom-4 text-white"
												style={{
													marginTop: "20px",
													display: "inline-block",
													width: "30%",
												}}
											>
												Sign Up
											</Button>
										</Form>
										<p className="text-center text-muted mt-5 mb-0">
											Already have an account?{" "}
											<Link to="/login" className="fw-bold text-body">
												<u>Login here</u>
											</Link>
										</p>
									</Container>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SignupForm;
