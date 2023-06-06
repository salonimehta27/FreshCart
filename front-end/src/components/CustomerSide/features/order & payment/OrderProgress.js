import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Card, Row, Col } from "react-bootstrap";

const OrderProgress = ({
	orderProgress,
	carDetails,
	store,
	storeAddress,
	estimatedTime,
	driverName,
}) => {
	const calculateProgressPercentage = (orderProgress) => {
		let progressPercentage = 0;
		if (orderProgress === "Driver is on their way to pick groceries") {
			progressPercentage = 25;
		} else if (
			orderProgress === "Driver has picked the grocery and is on their way"
		) {
			progressPercentage = 50;
		} else if (orderProgress === "Delivered") {
			progressPercentage = 100;
		}
		return progressPercentage;
	};

	const progressPercentage = calculateProgressPercentage(orderProgress);

	return (
		<div className="container mt-6" style={{ marginTop: "10px" }}>
			<Card className="p-1">
				<h2> Order Progress</h2>
				<Row>
					<Col>
						<LinearProgress
							variant="determinate"
							value={progressPercentage}
							style={{ height: "10px" }}
						/>
					</Col>
				</Row>
				<Card className="p-4" style={{ border: "none" }}>
					<Row>
						<Col>
							<h5>Order Status:</h5>
							<p>{orderProgress}</p>
						</Col>
						<Col>
							<h5>Car Details:</h5>
							<p>{carDetails}</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<h5>Store:</h5>
							<p>{store}</p>
						</Col>
						<Col>
							<h5>Store Address:</h5>
							<p>{storeAddress}</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<h5>Estimated Delivery Time:</h5>
							<p>{estimatedTime.toFixed(2)} mins</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<h5>Driver Name:</h5>
							<p>{driverName}</p>
						</Col>
					</Row>
				</Card>
			</Card>
		</div>
	);
};
export default OrderProgress;
