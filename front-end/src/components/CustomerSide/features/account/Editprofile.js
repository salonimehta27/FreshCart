import React, { useState } from "react";
import { Form, FormControl, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAdded } from "./loginSlice";

function Editprofile(currentUser) {
	const dispatch = useDispatch();
	const [password, setPassword] = useState({
		password: "",
		password_confirmation: "",
	});
	const [username, setUsername] = useState({
		username: currentUser.currentUser.username,
	});

	function handleChange(e) {
		if (e.target.name === "username") {
			setUsername({ ...username, [e.target.name]: e.target.value });
		} else if (
			e.target.name === "password" ||
			e.target.name === "password_confirmation"
		) {
			setPassword({ ...password, [e.target.name]: e.target.value });
		}
	}
	function handleUpdate(obj) {
		fetch(`http://localhost:5000/users/${currentUser.currentUser.id}`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(obj),
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(currentUserAdded(data));
			});
	}

	return (
		<Row className="justify-content-md-center">
			<Col xs sm="7">
				<Form>
					<Form.Group>
						<Form.Label>
							FirstName:
							<Form.Control
								type="text"
								className="form-control"
								name="first_name"
								rows={3}
								placeholder={currentUser.currentUser.fname}
								disabled
							/>
						</Form.Label>
					</Form.Group>
					<Form.Group>
						<Form.Label>
							LastName
							<Form.Control
								type="text"
								className="form-control"
								name="last_name"
								rows={3}
								placeholder={currentUser.currentUser.lname}
								disabled
							/>
						</Form.Label>
					</Form.Group>
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="text"
							name="description"
							placeholder={currentUser.currentUser.email}
							rows={3}
							disabled
						/>
					</Form.Group>

					<Form.Group>
						<>
							<Form.Label>Username</Form.Label>
							<FormControl
								type="text"
								name="username"
								value={username.username}
								onChange={handleChange}
								aria-label="Amount (to the nearest dollar)"
							/>
						</>
						<Button variant="secondary" onClick={() => handleUpdate(username)}>
							Change Username
						</Button>
					</Form.Group>
					<>
						<Form.Group>
							<Form.Label>New Password</Form.Label>
							<Form.Control
								type="password"
								name="password"
								onChange={handleChange}
								value={password.password}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type="password"
								name="password_confirmation"
								value={password.password_confirmation}
								onChange={handleChange}
							/>
						</Form.Group>
					</>
					<Button variant="secondary" onClick={() => handleUpdate(password)}>
						Change Password
					</Button>
				</Form>
			</Col>
		</Row>
	);
}

export default Editprofile;
