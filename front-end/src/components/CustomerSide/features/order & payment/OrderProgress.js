import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

const OrderProgress = ({
	orderProgress,
	carDetails,
	store,
	storeAddress,
	estimatedTime,
	driverName,
	orderNumber,
	orderDate,
}) => {
	const calculateProgressStep = (orderProgress) => {
		let progressStep = 0;
		if (orderProgress === "Driver is on their way to pick groceries") {
			progressStep = 1;
		} else if (
			orderProgress === "Driver has picked the grocery and is on their way"
		) {
			progressStep = 2;
		} else if (orderProgress === "Delivered") {
			progressStep = 3;
		}
		return progressStep;
	};

	const progressStep = calculateProgressStep(orderProgress);
	const date = new Date(orderDate);
	const monthNumber = date.getMonth();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthName = monthNames[monthNumber];
	const expectedArrivalDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;

	return (
		<section>
			<div className="container h-20">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-12">
						<div
							className="card card-stepper text-black"
							style={{ borderRadius: "1px", zIndex: "0" }}
						>
							<div className="card-body p-5">
								<div className="d-flex justify-content-between align-items-center mb-5">
									<div>
										<h5 className="mb-0">
											Order number{" "}
											<span className="text-primary font-weight-bold">
												#{orderNumber}
											</span>
										</h5>
									</div>
									<div className="text-end">
										<p className="mb-0">
											Expected Arrival: {expectedArrivalDate}
										</p>
									</div>
								</div>
								<LinearProgress
									variant="determinate"
									value={(progressStep / 3) * 100}
									className="mt-5"
								/>

								<div className="d-flex justify-content-between">
									<div className="d-lg-flex align-items-center">
										<i className="fas fa-clipboard-list fa-3x me-lg-4 mb-3 mb-lg-0"></i>
										<div>
											<p className="fw-bold mb-1">Order</p>
											<p className="fw-bold mb-0">Processed</p>
										</div>
									</div>
									<div className="d-lg-flex align-items-center">
										<i className="fas fa-box-open fa-3x me-lg-4 mb-3 mb-lg-0"></i>
										<div>
											<p className="fw-bold mb-1">Order</p>
											<p className="fw-bold mb-0">Driver is enroute</p>
										</div>
									</div>
									<div className="d-lg-flex align-items-center">
										<i className="fas fa-shipping-fast fa-3x me-lg-4 mb-3 mb-lg-0"></i>
										<div>
											<p className="fw-bold mb-1">Order</p>
											<p className="fw-bold mb-0">En Route</p>
										</div>
									</div>
									<div className="d-lg-flex align-items-center">
										<i className="fas fa-home fa-3x me-lg-4 mb-3 mb-lg-0"></i>
										<div>
											<p className="fw-bold mb-1">Order</p>
											<p className="fw-bold mb-0">Arrived</p>
										</div>
									</div>
								</div>

								<div className="mt-5">
									<div className="row">
										<div className="col-lg-6">
											<h5>Order Progress:</h5>
											<p>{orderProgress}</p>
											<h5>Car Details:</h5>
											<p>{carDetails}</p>
											<h5>Driver Name:</h5>
											<p>{driverName}</p>
										</div>
										<div className="col-lg-6">
											<h5>Store:</h5>
											<p>{store}</p>
											<h5>Store Address:</h5>
											<p>{storeAddress}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OrderProgress;
