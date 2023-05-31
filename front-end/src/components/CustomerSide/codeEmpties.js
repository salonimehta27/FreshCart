// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			let currentStep;
// 			let endLocation;

// 			if (
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver is in the Walmart phase
// 				currentStep =
// 					directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 				console.log("Driver is in the Walmart phase");
// 				console.log("Current Walmart Step:", currentStep);
// 			} else if (
// 				currentStepIndex <
// 				directionsToWalmart.routes[0].legs[0].steps.length +
// 					directionsToCustomer.routes[0].legs[0].steps.length
// 			) {
// 				// Driver is in the customer phase
// 				const customerStepIndex =
// 					currentStepIndex -
// 					directionsToWalmart.routes[0].legs[0].steps.length;
// 				currentStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 				console.log("Driver is in the customer phase");
// 				console.log("Current Customer Step:", currentStep);
// 			} else {
// 				clearInterval(timer); // Stop the timer as the driver has completed the trip
// 				console.log("Driver has completed the trip");
// 				return;
// 			}

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			console.log("Updating driver location:", nextLocation);
// 			socket.emit("driver-location-update", {
// 				id: driver.id,
// 				driverLocation: nextLocation,
// 			});

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(driver.location, endLocation) <= 0.001) {
// 				currentStepIndex++; // Move to the next step
// 			}
// 		}
// 	}, 2000); // Update every 2 seconds

// 	return () => clearInterval(timer);
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	// Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			let currentStepIndex = 0;
// 			let currentStep;
// 			let endLocation;
// 			console.log("directionsToWalmart:", directionsToWalmart);
// 			console.log("directionsToCustomer:", directionsToCustomer);
// 			console.log("current step index", currentStepIndex);

// 			if (
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver is in the Walmart phase
// 				currentStep =
// 					directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			} else if (
// 				currentStepIndex <
// 				directionsToWalmart.routes[0].legs[0].steps.length +
// 					directionsToCustomer.routes[0].legs[0].steps.length
// 			) {
// 				// Driver is in the customer phase
// 				console.log("yes");
// 				const customerStepIndex =
// 					currentStepIndex -
// 					directionsToWalmart.routes[0].legs[0].steps.length -
// 					1;
// 				currentStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			} else {
// 				clearInterval(timer); // Stop the timer as the driver has completed the trip
// 			}

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);
// 			console.log("startLocation:", startLocation);
// 			console.log("endLocation:", endLocation);
// 			console.log("distance:", distance);
// 			console.log("bearing:", bearing);
// 			console.log("nextLocation:", nextLocation);

// 			// Emit the updated driver location to the server

// 			console.log(calculateDistance(driver.location, endLocation));
// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(driver.location, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndex + 1 ===
// 					directionsToWalmart.routes[0].legs[0].steps.length
// 				) {
// 					// Driver has reached the last step of the Walmart directions

// 					currentStepIndex++; // Move to the next step (Walmart to customer)
// 					console.log(currentStepIndex);
// 				} else if (
// 					currentStepIndex ===
// 					directionsToWalmart.routes[0].legs[0].steps.length
// 				) {
// 					// Driver has reached the last step of the transition from Walmart to customer
// 					if (
// 						currentStepIndex ===
// 						directionsToWalmart.routes[0].legs[0].steps.length +
// 							directionsToCustomer.routes[0].legs[0].steps.length -
// 							1
// 					) {
// 						clearInterval(timer); // Stop the timer
// 					} else {
// 						currentStepIndex++; // Move to the next step (customer step)
// 					}
// 				} else {
// 					currentStepIndex++; // Move to the next step in the current directions
// 				}
// 			}
// 			if (nextLocation) {
// 				console.log("Updating driver location:", nextLocation);
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}
// 		}
// 	}, 2000); // Update every 5 seconds

// 	return () => clearInterval(timer);
// }, [driver, directionsToCustomer, directionsToWalmart]);

// const updateDirections = () => {
// 	if (driver && driver.location && walmartLocation && customerLoc) {
// 		const directionsService = new google.maps.DirectionsService();
// 		const driverLocation = new google.maps.LatLng(
// 			parseFloat(driver.location.latitude),
// 			parseFloat(driver.location.longitude)
// 		);
// 		const walmartLocation = new google.maps.LatLng(
// 			parseFloat(walmartLocation.latitude),
// 			parseFloat(walmartLocation.longitude)
// 		);
// 		const custLocation = new google.maps.LatLng(
// 			customerLoc.lat,
// 			customerLoc.lng
// 		);

// 		// Calculate directions from driver's location to Walmart
// 		directionsService.route(
// 			{
// 				origin: driverLocation,
// 				destination: walmartLocation,
// 				travelMode: "DRIVING",
// 			},
// 			(response, status) => {
// 				if (status === "OK") {
// 					setDirectionsToWalmart(response);
// 				} else {
// 					console.log("Directions request failed due to " + status);
// 				}
// 			}
// 		);

// 		// Calculate directions from Walmart to customer's place
// 		directionsService.route(
// 			{
// 				origin: walmartLocation,
// 				destination: custLocation,
// 				travelMode: "DRIVING",
// 			},
// 			(response, status) => {
// 				if (status === "OK") {
// 					setDirectionsToCustomer(response);
// 				} else {
// 					console.log("Directions request failed due to " + status);
// 				}
// 			}
// 		);
// 	}
// };

// const MemoizedDirectionsService = React.memo(DirectionsService);

// useEffect(() => {
// 	// Call the updateDirections function initially
// 	updateDirections();

// 	// Set an interval to update directions every 10 seconds
// 	const interval = setInterval(() => {
// 		updateDirections();
// 	}, 10000);

// 	// Clear the interval when the component is unmounted
// 	return () => clearInterval(interval);
// }, [driver, place]);

// Rest of the code...

function updateDriverLocation(driverId, driverLocation) {
	fetch(`http://localhost:5000/update_driver_location`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id: driverId, driverLocation }),
	})
		.then((res) => res.json())
		.then((data) => {
			setDriver(data);
		});
}

// function moveTowards(currentLocation, targetLocation, distance) {
// 	const bearing = calculateBearing(currentLocation, targetLocation);
// 	const currentLatRad = toRadians(currentLocation.latitude);
// 	const currentLonRad = toRadians(currentLocation.longitude);

// 	const newLatRad = Math.asin(
// 		Math.sin(currentLatRad) * Math.cos(distance / EarthRadius) +
// 			Math.cos(currentLatRad) *
// 				Math.sin(distance / EarthRadius) *
// 				Math.cos(bearing)
// 	);

// 	const newLonRad =
// 		currentLonRad +
// 		Math.atan2(
// 			Math.sin(bearing) *
// 				Math.sin(distance / EarthRadius) *
// 				Math.cos(currentLatRad),
// 			Math.cos(distance / EarthRadius) -
// 				Math.sin(currentLatRad) * Math.sin(newLatRad)
// 		);

// 	return {
// 		latitude: toDegrees(newLatRad),
// 		longitude: toDegrees(newLonRad),
// 	};
// }

// Calculate the bearing (direction) from the current location to the target location
// function calculateBearing(currentLocation, targetLocation) {
// 	const lat1 = toRadians(currentLocation.latitude);
// 	const lon1 = toRadians(currentLocation.longitude);
// 	const lat2 = toRadians(targetLocation.latitude);
// 	const lon2 = toRadians(targetLocation.longitude);

// 	const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
// 	const x =
// 		Math.cos(lat1) * Math.sin(lat2) -
// 		Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

// 	const bearing = Math.atan2(y, x);

// 	return bearing;
// }

// // Convert radians to degrees
// function toDegrees(radians) {
// 	return radians * (180 / Math.PI);
// }

// const moveTowards = (currentLocation, targetLocation, speed) => {
// 	const latDiff = targetLocation.latitude - currentLocation.latitude;
// 	const lngDiff = targetLocation.longitude - currentLocation.longitude;

// 	const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

// 	const ratio = speed / distance;
// 	const newLat = currentLocation.latitude + latDiff * ratio;
// 	const newLng = currentLocation.longitude + lngDiff * ratio;

// 	return {
// 		latitude: newLat,
// 		longitude: newLng,
// 	};
// };

// if (distance <= movementThreshold) {
// 	currentStage = (currentStage + 1) % 2;
// }
{
	/* {driver && walmartLocation && (
								<>
									<DirectionsService
										options={{
											origin: `${driver.location.latitude},${driver.location.longitude}`,
											destination: `${walmartLocation.latitude},${walmartLocation.longitude}`,
											travelMode: "DRIVING",
										}}
										callback={handleDirectionsToWalmartResponse}
									/>
									<DirectionsService
										options={{
											origin: `${walmartLocation.latitude},${walmartLocation.longitude}`,
											destination: `${customerLoc.lat},${customerLoc.lng}`,
											travelMode: "DRIVING",
										}}
										callback={handleDirectionsToPlaceResponse}
									/>
								</>
							)} */
}

// function handleClick(id) {
// 	console.log(currentRep);

// 	const acceptQueryRequest = fetch(
// 		`http://localhost:5000/accept-query/${id}`,
// 		{
// 			method: "PATCH",
// 			credentials: "include",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				is_accepted: true,
// 				customer_rep_id: currentRep.customer_rep_id,
// 			}),
// 		}
// 	).then((r) => r.json());

// 	const getChatMessagesRequest = fetch(
// 		`http://localhost:5000/get_chat_messages/${id}`,
// 		{
// 			credentials: "include",
// 		}
// 	).then((r) => r.json());

// 	Promise.all([acceptQueryRequest, getChatMessagesRequest]).then(
// 		([acceptQueryData, chatMessagesData]) => {
// 			setQueries((prevQueries) => {
// 				const updatedQueries = prevQueries.filter(
// 					(q) => q.id !== acceptQueryData.id
// 				);
// 				return updatedQueries;
// 			});
// 			setShowChatBox(true);
// 			dispatch(loadAdminChatMessages(chatMessagesData));
// 			setChatMessages(chatMessagesData);
// 		}
// 	);
// }

// useEffect(() => {
// 	socket.on("message", (data) => {
// 		// Extract the sender and message from the received data
// 		const { sender, message } = data;

// 		// Dispatch the addChatMessage action with the received data
// 		dispatch(addChatMessage(sender, message));
// 	});
// 	// Cleanup the socket connection on component unmount
// 	return () => {
// 		socket.disconnect();
// 	};
// }, []);

useEffect(() => {
	socket.on("message", (data) => {
		const { sender, message } = data;

		if (sender === "Customer_rep") {
			// Dispatch the addChatMessage action with the received data from the representative
			dispatch(addChatMessage(sender, message));
		} else {
			// Handle other senders (User, Chatbot) as before
			dispatch(addChatMessage(sender, message));
		}
	});

	return () => {
		socket.disconnect();
	};
}, []);

// console.log(directions.routes[0].legs[0].steps.length);
// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (currentStepIndex >= directions.routes[0].legs[0].steps.length) {
// 			clearInterval(timer); // Stop the timer when all steps are completed
// 			return;
// 		}

// 		// Get the current step from the directions
// 		const currentStep = directions.routes[0].legs[0].steps[currentStepIndex];

// 		// Get the start and end location of the current step
// 		const startLocation = currentStep.start_location;
// 		const endLocation = currentStep.end_location;

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);
// 		console.log(startLocation, endLocation);
// 		console.log(distance);
// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Check if the driver has reached the end of the current step
// 		if (calculateDistance(nextLocation, endLocation) <= 0.001) {
// 			currentStepIndex++; // Move to the next step in the directions
// 		}
// 	}, 5000); // Update every 5 seconds
// 	// console.log(driver.location);
// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directions]);

function calculateDistance(location1, location2) {
	const R = 6371; // Radius of the Earth in kilometers
	let lat1, lon1, lat2, lon2;

	if ("latitude" in location1 && "longitude" in location1) {
		lat1 = toRadians(parseFloat(location1.latitude));
		lon1 = toRadians(parseFloat(location1.longitude));
	} else if ("lat" in location1 && "lng" in location1) {
		lat1 = toRadians(location1.lat);
		lon1 = toRadians(location1.lng);
	} else {
		throw new Error("Invalid location1 object");
	}

	if ("lat" in location2 && "lng" in location2) {
		lat2 = toRadians(location2.lat);
		lon2 = toRadians(location2.lng);
	} else if ("latitude" in location2 && "longitude" in location2) {
		lat2 = toRadians(parseFloat(location2.latitude));
		lon2 = toRadians(parseFloat(location2.longitude));
	} else {
		throw new Error("Invalid location2 object");
	}
	console.log(lat1, lat2, lon1, lon2);
	const dlat = lat2 - lat1;
	const dlon = lon2 - lon1;

	const a =
		Math.sin(dlat / 2) * Math.sin(dlat / 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in kilometers

	return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
	return degrees * (Math.PI / 180);
}

// Helper function to calculate the bearing between two locations
function calculateBearing(location1, location2) {
	const lat1 = toRadians(location1.lat);
	const lon1 = toRadians(location1.lng);
	const lat2 = toRadians(location2.lat);
	const lon2 = toRadians(location2.lng);

	const dlon = lon2 - lon1;

	const y = Math.sin(dlon) * Math.cos(lat2);
	const x =
		Math.cos(lat1) * Math.sin(lat2) -
		Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);

	const bearing = (Math.atan2(y, x) * 180) / Math.PI; // Bearing in degrees

	return (bearing + 360) % 360; // Normalize bearing to a value between 0 and 360 degrees
}

// Helper function to calculate the next location based on the current location, distance, and bearing
function calculateNextLocation(currentLocation, distance, bearing) {
	const R = 6371; // Radius of the Earth in kilometers
	const d = distance / R; // Distance in radians

	const lat1 = toRadians(currentLocation.latitude);
	const lon1 = toRadians(currentLocation.longitude);
	const brng = toRadians(bearing);

	const lat2 = Math.asin(
		Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
	);

	const lon2 =
		lon1 +
		Math.atan2(
			Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
			Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
		);

	// Convert the next location to degrees
	const nextLocation = {
		latitude: toDegrees(lat2),
		longitude: toDegrees(lon2),
	};

	return nextLocation;
}

// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			const directions =
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 					? directionsToWalmart
// 					: directionsToCustomer;

// 			const currentStep =
// 				directions.routes[0].legs[0].steps[currentStepIndex];
// 			const endLocation = {
// 				lat: currentStep.end_location.lat(),
// 				lng: currentStep.end_location.lng(),
// 			};

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			if (nextLocation) {
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}
// 			console.log("next location", nextLocation)

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(driver.location, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndex ===
// 					directions.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Driver has reached the last step of the directions
// 					if (
// 						currentStepIndex >=
// 						directionsToWalmart.routes[0].legs[0].steps.length
// 					) {
// 						clearInterval(timer); // Stop the timer
// 					} else {
// 						currentStepIndex++; // Move to the next step in the directions
// 					}
// 				} else {
// 					currentStepIndex++; // Move to the next step in the directions
// 				}
// 			}
// 		}
// 	}, 1000); // Update every 1 second

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToWalmart, directionsToCustomer]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			const directions =
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 					? directionsToWalmart
// 					: directionsToCustomer;

// 			const currentStep =
// 				directions.routes[0].legs[0].steps[currentStepIndex];
// 			const endLocation = {
// 				lat: currentStep.end_location.lat(),
// 				lng: currentStep.end_location.lng(),
// 			};

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			if (nextLocation) {
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(nextLocation, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndex ===
// 					directions.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Driver has reached the last step of the directions
// 					clearInterval(timer); // Stop the timer
// 				} else {
// 					currentStepIndex++; // Move to the next step in the directions
// 				}
// 			}
// 		}
// 	}, 1000); // Update every 1 second

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToWalmart, directionsToCustomer]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			let currentStep;
// 			let endLocation;

// 			if (
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver to Walmart step
// 				currentStep =
// 					directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			} else {
// 				// Walmart to customer step
// 				currentStep =
// 					directionsToCustomer.routes[0].legs[0].steps[
// 						currentStepIndex -
// 							directionsToWalmart.routes[0].legs[0].steps.length
// 					];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			}

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			let nextLocation;
// 			if (
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver to Walmart step
// 				nextLocation = calculateNextLocation(
// 					driver.location,
// 					distance,
// 					bearing
// 				);
// 			} else {
// 				// Walmart to customer step
// 				nextLocation = calculateNextLocation(
// 					driver.location,
// 					distance,
// 					bearing + 180
// 				);
// 			}

// 			// Emit the updated driver location to the server
// 			if (nextLocation) {
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}

// 			console.log(distance);

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(nextLocation, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndex ===
// 					directionsToWalmart.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Driver has reached the last step of the Walmart directions
// 					currentStepIndex =
// 						directionsToWalmart.routes[0].legs[0].steps.length; // Set currentStepIndex to indicate transition from Walmart to customer
// 				} else if (
// 					currentStepIndex ===
// 					directionsToWalmart.routes[0].legs[0].steps.length
// 				) {
// 					// Driver has reached the last step of the transition from Walmart to customer
// 					currentStepIndex++; // Move to the next step (customer step)
// 				} else {
// 					currentStepIndex++; // Move to the next step in the current directions
// 				}
// 			}
// 		}
// 	}, 1000); // Update every 1 second

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentStepIndexToWalmart = 0; // Keep track of the current step index in the directions to Walmart
// 	let currentStepIndexToCustomer = 0; // Keep track of the current step index in the directions to the customer

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			let currentStep;
// 			let endLocation;
// 			console.log("directionsToWalmart:", directionsToWalmart);
// 			console.log("directionsToCustomer:", directionsToCustomer);

// 			console.log("currentStepIndexToWalmart", currentStepIndexToWalmart);
// 			console.log(
// 				"directionsToWalmart.routes[0].legs[0].steps.length",
// 				directionsToWalmart.routes[0].legs[0].steps.length
// 			);
// 			console.log("currentStepIndexToCustomer", currentStepIndexToCustomer);
// 			console.log(
// 				"directionsToCustomer.routes[0].legs[0].steps.length",
// 				directionsToCustomer.routes[0].legs[0].steps.length
// 			);
// 			if (
// 				currentStepIndexToWalmart <
// 				directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver to Walmart step
// 				console.log("Reached driver to Walmart step");
// 				currentStep =
// 					directionsToWalmart.routes[0].legs[0].steps[
// 						currentStepIndexToWalmart
// 					];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 				currentStepIndexToWalmart++;
// 			} else if (
// 				currentStepIndexToCustomer <
// 				directionsToCustomer.routes[0].legs[0].steps.length
// 			) {
// 				// Walmart to customer step
// 				console.log("Reached Walmart to customer step");
// 				currentStep =
// 					directionsToCustomer.routes[0].legs[0].steps[
// 						currentStepIndexToCustomer
// 					];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 				currentStepIndexToCustomer++;
// 			} else {
// 				// Driver has completed both sets of directions
// 				console.log("Completed both sets of directions");
// 				return;
// 			}

// 			console.log(currentStep.end_location);
// 			// console.log("end"endLocation);
// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// console.log("start", startLocation);
// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			console.log(distance);
// 			console.log(bearing);
// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			if (nextLocation) {
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(driver.location, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndexToWalmart ===
// 					directionsToWalmart.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Driver has reached the last step of the Walmart directions
// 					currentStepIndexToWalmart++; // Move to the next step (Walmart to customer)
// 				} else if (
// 					currentStepIndexToCustomer ===
// 					directionsToCustomer.routes[0].legs[0].steps.length
// 				) {
// 					// Driver has reached the last step of the Walmart to customer directions
// 					currentStepIndexToCustomer++; // Move to the next step (completed both sets of directions)
// 				} else {
// 					// Move to the next step in the current directions
// 					if (
// 						currentStepIndexToWalmart <
// 						directionsToWalmart.routes[0].legs[0].steps.length
// 					) {
// 						currentStepIndexToWalmart++;
// 					} else {
// 						currentStepIndexToCustomer++;
// 					}
// 				}
// 			}
// 		}
// 	}, 10000); // Update every 1 second

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToWalmart, directionsToCustomer]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		if (directionsToWalmart && directionsToCustomer) {
// 			let currentStep;
// 			let endLocation;

// 			// Determine the current step based on the driver's location
// 			if (
// 				currentStepIndex < directionsToWalmart.routes[0].legs[0].steps.length
// 			) {
// 				// Driver to Walmart step
// 				currentStep =
// 					directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			} else {
// 				// Walmart to customer step
// 				currentStep =
// 					directionsToCustomer.routes[0].legs[0].steps[
// 						currentStepIndex -
// 							directionsToWalmart.routes[0].legs[0].steps.length
// 					];
// 				endLocation = {
// 					lat: currentStep.end_location.lat(),
// 					lng: currentStep.end_location.lng(),
// 				};
// 			}

// 			// Get the start location of the current step
// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			if (nextLocation) {
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: nextLocation,
// 				});
// 			}

// 			// Check if the driver has reached the end of the current step
// 			if (calculateDistance(driver.location, endLocation) <= 0.001) {
// 				if (
// 					currentStepIndex ===
// 					directionsToWalmart.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Driver has reached the last step of the Walmart directions
// 					currentStepIndex =
// 						directionsToWalmart.routes[0].legs[0].steps.length; // Set currentStepIndex to indicate transition from Walmart to customer
// 				} else {
// 					currentStepIndex++; // Move to the next step in the current directions
// 				}
// 			}
// 		}
// 	}, 1000); // Update every 1 second

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToWalmart, directionsToCustomer]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Initial step index is 0

// 	const timer = setInterval(() => {
// 		const currentStep =
// 			directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);

// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Check if reached the end of directionsToWalmart
// 		if (
// 			currentStepIndex >=
// 			directionsToWalmart.routes[0].legs[0].steps.length - 1
// 		) {
// 			clearInterval(timer); // Stop the timer as the driver has reached the end of directionsToWalmart

// 			let customerStepIndex = 0; // Initial step index for directionsToCustomer is 0
// 			let customerStartLocation = {
// 				lat: endLocation.lat,
// 				lng: endLocation.lng,
// 			}; // Starting location for directionsToCustomer is the end location of the last step in directionsToWalmart

// 			const customerTimer = setInterval(() => {
// 				const customerStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

// 				const customerEndLocation = {
// 					lat: customerStep.end_location.lat(),
// 					lng: customerStep.end_location.lng(),
// 				};

// 				// Calculate the distance and bearing between the start and end locations for directionsToCustomer
// 				const customerDistance = calculateDistance(
// 					customerStartLocation,
// 					customerEndLocation
// 				);
// 				const customerBearing = calculateBearing(
// 					customerStartLocation,
// 					customerEndLocation
// 				);

// 				// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
// 				const customerNextLocation = calculateNextLocation(
// 					customerStartLocation,
// 					customerDistance,
// 					customerBearing
// 				);

// 				// Emit the updated driver location to the server
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: customerNextLocation,
// 				});

// 				// Check if reached the end of directionsToCustomer
// 				if (
// 					customerStepIndex >=
// 					directionsToCustomer.routes[0].legs[0].steps.length - 1
// 				) {
// 					clearInterval(customerTimer); // Stop the timer as the driver has reached the end of directionsToCustomer
// 					return;
// 				}

// 				// Increment the step index for directionsToCustomer
// 				customerStepIndex++;
// 				// Set the start location for the next step as the end location of the current step
// 				customerStartLocation = customerEndLocation;
// 			}, 1000);

// 			return () => {
// 				clearInterval(customerTimer); // Cleanup the customerTimer when the component unmounts or when directionsToCustomer is completed
// 				clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToCustomer is completed
// 			};
// 		}

// 		// Increment the step index for directionsToWalmart
// 		currentStepIndex++;
// 	}, 20000);

// 	return () => {
// 		clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToWalmart is completed
// 	};
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Initial step index is 0

// 	const timer = setInterval(() => {
// 		const currentStep =
// 			directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);

// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Check if reached the end of directionsToWalmart
// 		if (
// 			currentStepIndex >=
// 			directionsToWalmart.routes[0].legs[0].steps.length - 1
// 		) {
// 			clearInterval(timer); // Stop the timer as the driver has reached the end of directionsToWalmart

// 			let customerStepIndex = 0; // Initial step index for directionsToCustomer is 0
// 			let customerStartLocation = {
// 				lat: endLocation.lat,
// 				lng: endLocation.lng,
// 			}; // Starting location for directionsToCustomer is the end location of the last step in directionsToWalmart

// 			const customerTimer = setInterval(() => {
// 				const customerStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

// 				const customerEndLocation = {
// 					lat: customerStep.end_location.lat(),
// 					lng: customerStep.end_location.lng(),
// 				};

// 				// Calculate the distance and bearing between the start and end locations for directionsToCustomer
// 				const customerDistance = calculateDistance(
// 					customerStartLocation,
// 					customerEndLocation
// 				);
// 				const customerBearing = calculateBearing(
// 					customerStartLocation,
// 					customerEndLocation
// 				);

// 				// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
// 				const customerNextLocation = calculateNextLocation(
// 					customerStartLocation,
// 					customerDistance,
// 					customerBearing
// 				);

// 				// Emit the updated driver location to the server
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: customerNextLocation,
// 				});

// 				// Check if reached the end of directionsToCustomer
// 				if (
// 					customerStepIndex >=
// 					directionsToCustomer.routes[0].legs[0].steps.length - 1
// 				) {
// 					clearInterval(customerTimer); // Stop the timer as the driver has reached the end of directionsToCustomer
// 					clearInterval(timer); // Stop the timer completely as the driver has reached the customer
// 					return;
// 				}

// 				// Increment the step index for directionsToCustomer
// 				customerStepIndex++;
// 				// Set the start location for the next step as the end location of the current step
// 				customerStartLocation = customerEndLocation;
// 			}, 1000);

// 			return () => {
// 				clearInterval(customerTimer); // Cleanup the customerTimer when the component unmounts or when directionsToCustomer is completed
// 				clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToCustomer is completed
// 			};
// 		}

// 		// Increment the step index for directionsToWalmart
// 		currentStepIndex++;
// 	}, 1000);

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToWalmart is completed
// }, [driver, directionsToCustomer, directionsToWalmart]);

// working
// useEffect(() => {
// 	let currentStepIndex = 0; // Initial step index is 0

// 	const timer = setInterval(() => {
// 		const currentStep =
// 			directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);

// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Check if reached the end of directionsToWalmart
// 		if (
// 			currentStepIndex >=
// 			directionsToWalmart.routes[0].legs[0].steps.length - 1
// 		) {
// 			// Reached the end of directionsToWalmart, stop the current timer and start the timer for directionsToCustomer
// 			clearInterval(timer);

// 			let customerStepIndex = 0; // Initial step index for directionsToCustomer is 0
// 			let customerStartLocation = {
// 				lat: endLocation.lat,
// 				lng: endLocation.lng,
// 			}; // Starting location for directionsToCustomer is the end location of the last step in directionsToWalmart

// 			const customerTimer = setInterval(() => {
// 				const customerStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

// 				const customerEndLocation = {
// 					lat: customerStep.end_location.lat(),
// 					lng: customerStep.end_location.lng(),
// 				};

// 				// Calculate the distance and bearing between the start and end locations for directionsToCustomer
// 				const customerDistance = calculateDistance(
// 					customerStartLocation,
// 					customerEndLocation
// 				);
// 				const customerBearing = calculateBearing(
// 					customerStartLocation,
// 					customerEndLocation
// 				);

// 				// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
// 				const customerNextLocation = calculateNextLocation(
// 					customerStartLocation,
// 					customerDistance,
// 					customerBearing
// 				);

// 				// Emit the updated driver location to the server
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: customerNextLocation,
// 				});

// 				// Check if reached the end of directionsToCustomer
// 				if (
// 					customerStepIndex >=
// 					directionsToCustomer.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Reached the end of directionsToCustomer, stop the customerTimer
// 					clearInterval(customerTimer);
// 					clearInterval(timer); // Stop the timer as the driver has reached the customer
// 					return;
// 				}

// 				// Increment the step index for directionsToCustomer
// 				customerStepIndex++;
// 				// Set the start location for the next step as the end location of the current step
// 				customerStartLocation = customerEndLocation;
// 			}, 1000);

// 			return () => {
// 				clearInterval(customerTimer); // Cleanup the customerTimer when the component unmounts or when directionsToCustomer is completed
// 				clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToCustomer is completed
// 			};
// 		}

// 		// Increment the step index for directionsToWalmart
// 		currentStepIndex++;
// 	}, 1000);

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToWalmart is completed
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Initial step index is 0

// 	const timer = setInterval(() => {
// 		const currentStep =
// 			directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);

// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Check if reached the end of directionsToWalmart
// 		if (
// 			currentStepIndex >=
// 			directionsToWalmart.routes[0].legs[0].steps.length - 1
// 		) {
// 			// Reached the end of directionsToWalmart, stop the current timer and start the timer for directionsToCustomer
// 			clearInterval(timer);

// 			let customerStepIndex = 0; // Initial step index for directionsToCustomer is 0
// 			let customerStartLocation = {
// 				lat: endLocation.lat,
// 				lng: endLocation.lng,
// 			}; // Starting location for directionsToCustomer is the end location of the last step in directionsToWalmart

// 			const customerTimer = setInterval(() => {
// 				const customerStep =
// 					directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

// 				const customerEndLocation = {
// 					lat: customerStep.end_location.lat(),
// 					lng: customerStep.end_location.lng(),
// 				};

// 				// Calculate the distance and bearing between the start and end locations for directionsToCustomer
// 				const customerDistance = calculateDistance(
// 					customerStartLocation,
// 					customerEndLocation
// 				);
// 				const customerBearing = calculateBearing(
// 					customerStartLocation,
// 					customerEndLocation
// 				);

// 				// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
// 				const customerNextLocation = calculateNextLocation(
// 					customerStartLocation,
// 					customerDistance,
// 					customerBearing
// 				);

// 				// Emit the updated driver location to the server
// 				socket.emit("driver-location-update", {
// 					id: driver.id,
// 					driverLocation: customerNextLocation,
// 				});

// 				// Check if reached the end of directionsToCustomer
// 				if (
// 					customerStepIndex >=
// 					directionsToCustomer.routes[0].legs[0].steps.length - 1
// 				) {
// 					// Reached the end of directionsToCustomer, stop the customerTimer
// 					clearInterval(customerTimer);
// 					return;
// 				}

// 				// Increment the step index for directionsToCustomer
// 				customerStepIndex++;
// 				// Set the start location for the next step as the end location of the current step
// 				customerStartLocation = customerEndLocation;
// 			}, 1000);

// 			return () => clearInterval(customerTimer); // Cleanup the customerTimer when the component unmounts or when directionsToCustomer is completed
// 		}

// 		// Increment the step index for directionsToWalmart
// 		currentStepIndex++;
// 	}, 1000);

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts or when directionsToWalmart is completed
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentDirection = "toWalmart"; // Initial direction is "to Walmart"
// 	let currentStepIndex = 0; // Initial step index is 0

// 	const timer = setInterval(() => {
// 		const directions =
// 			currentDirection === "toWalmart"
// 				? directionsToWalmart
// 				: directionsToCustomer;

// 		console.log(currentDirection);
// 		if (currentStepIndex >= directions.routes[0].legs[0].steps.length) {
// 			// Reached the end of current direction's steps
// 			if (currentDirection === "toWalmart") {
// 				currentDirection = "toCustomer"; // Toggle to "to customer" direction
// 				currentStepIndex = 0; // Reset step index to 0
// 			} else {
// 				// Reached the end of both directions, do something else or stop the timer
// 				clearInterval(timer);
// 				return;
// 			}
// 		}

// 		const currentStep = directions.routes[0].legs[0].steps[currentStepIndex];

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);

// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		// Increment the step index
// 		currentStepIndex++;
// 	}, 1000);

// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentStepIndex = 0; // Keep track of the current step index in the directions

// 	const timer = setInterval(() => {
// 		// console.log(directionsToCustomer.routes[0].legs[0].steps.length);
// 		// console.log(
// 		// 	directionsToCustomer.routes[0].legs[0].steps[0].start_location.lat()
// 		// );
// 		// console.log(
// 		// 	directionsToCustomer.routes[0].legs[0].steps[0].start_location.lng()
// 		// );
// 		if (
// 			currentStepIndex >= directionsToCustomer.routes[0].legs[0].steps.length
// 		) {
// 			clearInterval(timer); // Stop the timer when all steps are completed
// 			return;
// 		}
// 		// console.log("directions", directions);
// 		// console.log("directions to customer", directionsToCustomer);
// 		// Get the current step from the directions
// 		//console.log(directionsToCustomer);
// 		const currentStep =
// 			directionsToCustomer.routes[0].legs[0].steps[currentStepIndex];

// 		// Get the start and end location of the current step
// 		// const startLocation = currentStep.start_location;
// 		// const endLocation = currentStep.end_location;

// 		const startLocation = {
// 			lat: currentStep.start_location.lat(),
// 			lng: currentStep.start_location.lng(),
// 		};

// 		const endLocation = {
// 			lat: currentStep.end_location.lat(),
// 			lng: currentStep.end_location.lng(),
// 		};

// 		// Calculate the distance and bearing between the start and end locations
// 		const distance = calculateDistance(startLocation, endLocation);
// 		const bearing = calculateBearing(startLocation, endLocation);
// 		console.log(startLocation, endLocation);
// 		console.log(distance);
// 		// Calculate the next location based on the current location, distance, and bearing
// 		const nextLocation = calculateNextLocation(
// 			driver.location,
// 			distance,
// 			bearing
// 		);

// 		// Emit the updated driver location to the server
// 		socket.emit("driver-location-update", {
// 			id: driver.id,
// 			driverLocation: nextLocation,
// 		});

// 		console.log(calculateDistance(nextLocation, endLocation));
// 		// Check if the driver has reached the end of the current step
// 		if (calculateDistance(nextLocation, endLocation) <= 0.001) {
// 			currentStepIndex++; // Move to the next step in the directions
// 		}
// 	}, 5000); // Update every 5 seconds
// 	// console.log(driver.location);
// 	return () => clearInterval(timer); // Cleanup the timer when the component unmounts
// }, [driver, directionsToCustomer, directionsToWalmart]);

// useEffect(() => {
// 	let currentStepIndex = 0;
// 	const timer = setInterval(() => {
// 		if (directionsToWalmart) {
// 			const currentStep =
// 				directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

// 			const startLocation = {
// 				lat: currentStep.start_location.lat(),
// 				lng: currentStep.start_location.lng(),
// 			};

// 			const endLocation = {
// 				lat: currentStep.end_location.lat(),
// 				lng: currentStep.end_location.lng(),
// 			};

// 			// Calculate the distance and bearing between the start and end locations
// 			const distance = calculateDistance(startLocation, endLocation);
// 			const bearing = calculateBearing(startLocation, endLocation);

// 			// Calculate the next location based on the current location, distance, and bearing
// 			const nextLocation = calculateNextLocation(
// 				driver.location,
// 				distance,
// 				bearing
// 			);

// 			// Emit the updated driver location to the server
// 			socket.emit("driver-location-update", {
// 				id: driver.id,
// 				driverLocation: nextLocation,
// 			});

// 			// Check if reached the end of directionsToWalmart
// 			if (
// 				currentStepIndex >=
// 				directionsToWalmart.routes[0].legs[0].steps.length - 1
// 			) {
// 				clearInterval(timer); // Stop the timer as the driver has reached the end of directionsToWalmart
// 				setReachedCustomer(true);
// 				return;
// 			}

// 			currentStepIndex++;
// 		}
// 	}, 100000);

// 	return () => {
// 		clearInterval(timer);
// 	};
// }, [driver, directionsToWalmart]);

// useEffect(() => {
// 	if (reachedCustomer && directionsToCustomer) {
// 		let customerStepIndex = 0;
// 		console.log("Reached customer:", reachedCustomer);
// 		let customerStartLocation = {
// 			lat: directionsToWalmart.routes[0].legs[0].steps[
// 				directionsToWalmart.routes[0].legs[0].steps.length - 1
// 			].end_location.lat(),
// 			lng: directionsToWalmart.routes[0].legs[0].steps[
// 				directionsToWalmart.routes[0].legs[0].steps.length - 1
// 			].end_location.lng(),
// 		};

// 		console.log(customerStartLocation);
// 		console.log(directionsToCustomer);

// 		const customerTimer = setInterval(() => {
// 			console.log("helloooo"); // <=== can't reach this
// 			const customerStep =
// 				directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

// 			const customerEndLocation = {
// 				lat: customerStep.end_location.lat(),
// 				lng: customerStep.end_location.lng(),
// 			};
// 			console.log(customerEndLocation);
// 			// Calculate the distance and bearing between the start and end locations for directionsToCustomer
// 			const customerDistance = calculateDistance(
// 				customerStartLocation,
// 				customerEndLocation
// 			);
// 			const customerBearing = calculateBearing(
// 				customerStartLocation,
// 				customerEndLocation
// 			);

// 			// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
// 			const customerNextLocation = calculateNextLocation(
// 				customerStartLocation,
// 				customerDistance,
// 				customerBearing
// 			);

// 			// Emit the updated driver location to the server
// 			socket.emit("driver-location-update", {
// 				id: driver.id,
// 				driverLocation: customerNextLocation,
// 			});

// 			// Check if reached the end of directionsToCustomer
// 			if (
// 				customerStepIndex >=
// 				directionsToCustomer.routes[0].legs[0].steps.length - 1
// 			) {
// 				clearInterval(customerTimer); // Stop the timer as the driver has reached the end of directionsToCustomer
// 				return;
// 			}

// 			customerStepIndex++;

// 			console.log(customerEndLocation);
// 			customerStartLocation = customerEndLocation;
// 		}, 100000);

// 		return () => {
// 			clearInterval(customerTimer);
// 		};
// 	}
// }, [driver, directionsToCustomer, reachedCustomer]);
