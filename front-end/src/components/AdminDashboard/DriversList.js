import React, { useState } from "react";

const drivers = [
	{
		id: 1,
		name: "John Doe",
		status: "Available",
		vehicle: "Toyota Corolla",
		license: "123456789",
	},
	{
		id: 2,
		name: "Jane Smith",
		status: "Unavailable",
		vehicle: "Honda Civic",
		license: "987654321",
	},
	{
		id: 3,
		name: "Bob Johnson",
		status: "Available",
		vehicle: "Ford Mustang",
		license: "456789123",
	},
];

const DriversList = () => {
	const [driverList, setDriverList] = useState(drivers);

	return (
		<div>
			<h2>Drivers List</h2>
			<table>
				<thead>
					<tr>
						<th>Driver ID</th>
						<th>Name</th>
						<th>Status</th>
						<th>Vehicle</th>
						<th>License Number</th>
					</tr>
				</thead>
				<tbody>
					{driverList.map((driver) => (
						<tr key={driver.id}>
							<td>{driver.id}</td>
							<td>{driver.name}</td>
							<td>{driver.status}</td>
							<td>{driver.vehicle}</td>
							<td>{driver.license}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DriversList;
