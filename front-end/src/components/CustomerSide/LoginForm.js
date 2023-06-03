import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { currentUserAdded } from "./loginSlice";
import { Container, Form, Button } from "react-bootstrap";
import grocery2 from "../CustomerSide/images/grocery2.jpeg";
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
		<section
			className="vh-100 bg-image"
			style={{
				backgroundImage: `url(${grocery2})`,
				backgroundSize: "cover",
			}}
		>
			<div className="mask d-flex align-items-center h-100 gradient-custom-3">
				<div className="container h-100">
					<div className="row d-flex justify-content-center align-items-center h-100">
						<div className="col-12 col-md-9 col-lg-7 col-xl-6">
							<div className="card" style={{ borderRadius: "15px" }}>
								<div className="card-body p-5">
									<h2 className="text-uppercase text-center mb-5">Login</h2>

									<Container>
										<Form onSubmit={handleSubmit}>
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

											<Button
												variant="success"
												type="submit"
												className="btn-lg gradient-custom-4 text-body"
												style={{ marginTop: "10px" }}
											>
												Log In
											</Button>
										</Form>
										<p className="text-center text-muted mt-5 mb-0">
											Don't have an account?{" "}
											<Link to="/signup" className="fw-bold text-body">
												<u>Sign up here</u>
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

export default LoginForm;
