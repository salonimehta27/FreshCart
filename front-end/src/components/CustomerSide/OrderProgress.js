import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderProgress = ({
	orderProgress,
	carDetails,
	store,
	storeAddress,
	estimatedTime,
}) => {
	return (
		<div className="container mt-5">
			<div className="card">
				<div className="card-header">
					<h2>Order Progress</h2>
				</div>
				<div className="card-body">
					<div className="row">
						<div className="col">
							<h5>Order Status:</h5>
							<p>{orderProgress}</p>
						</div>
						<div className="col">
							<h5>Car Details:</h5>
							<p>{carDetails}</p>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<h5>Store:</h5>
							<p>{store}</p>
						</div>
						<div className="col">
							<h5>Store Address:</h5>
							<p>{storeAddress}</p>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<h5>Estimated Delivery Time:</h5>
							<p>{estimatedTime}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderProgress;
