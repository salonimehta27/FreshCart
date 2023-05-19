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
