/*global google*/
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	GoogleMap,
	Marker,
	useLoadScript,
	DirectionsRenderer,
	DirectionsService,
} from "@react-google-maps/api";
import axios from "axios";
import { useSelector } from "react-redux";
import OrderProgress from "./OrderProgress";
import socket from "../../socket";
import carIcon from "../CustomerSide/images/car-icon.png";

const Map = () => {
	const [customerLoc, setCustomerLoc] = useState(null);
	const customerId = useSelector((state) => state.currentUser.entities);
	const address = useSelector((state) => state.currentUser.address);
	const [driver, setDriver] = useState(null);
	const [walmartLocation, setWalmartLocation] = useState(null);
	const [estimatedTime, setEstimatedTime] = useState(null);
	const [directions, setDirections] = useState(null);
	const [directionsToWalmart, setDirectionsToWalmart] = useState(null);
	const [directionsToCustomer, setDirectionsToCustomer] = useState(null);
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	});

	const cacheData = (key, data) => {
		localStorage.setItem(key, JSON.stringify(data));
	};

	const getCachedData = (key) => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	};
	const EarthRadius = 6371;
	// Calculate the distance between two locations using the Haversine formula
	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // Approximate radius of the Earth in kilometers
		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRadians(lat1)) *
				Math.cos(toRadians(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;

		return distance;
	}

	// Convert degrees to radians
	function toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	function moveTowards(currentLocation, targetLocation, distance) {
		const bearing = calculateBearing(currentLocation, targetLocation);
		const currentLatRad = toRadians(currentLocation.latitude);
		const currentLonRad = toRadians(currentLocation.longitude);

		const newLatRad = Math.asin(
			Math.sin(currentLatRad) * Math.cos(distance / EarthRadius) +
				Math.cos(currentLatRad) *
					Math.sin(distance / EarthRadius) *
					Math.cos(bearing)
		);

		const newLonRad =
			currentLonRad +
			Math.atan2(
				Math.sin(bearing) *
					Math.sin(distance / EarthRadius) *
					Math.cos(currentLatRad),
				Math.cos(distance / EarthRadius) -
					Math.sin(currentLatRad) * Math.sin(newLatRad)
			);

		return {
			latitude: toDegrees(newLatRad),
			longitude: toDegrees(newLonRad),
		};
	}

	//Calculate the bearing (direction) from the current location to the target location
	function calculateBearing(currentLocation, targetLocation) {
		const lat1 = toRadians(currentLocation.latitude);
		const lon1 = toRadians(currentLocation.longitude);
		const lat2 = toRadians(targetLocation.latitude);
		const lon2 = toRadians(targetLocation.longitude);

		const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
		const x =
			Math.cos(lat1) * Math.sin(lat2) -
			Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

		const bearing = Math.atan2(y, x);

		return bearing;
	}

	// Convert radians to degrees
	function toDegrees(radians) {
		return radians * (180 / Math.PI);
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cacheKey = "geocodeResponse";
				let geocodeResponse = getCachedData(cacheKey);
				console.log(geocodeResponse);
				if (!geocodeResponse) {
					console.log("google maps got touched");
					geocodeResponse = await axios.get(
						`https://maps.googleapis.com/maps/api/geocode/json?address=${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
					);
					cacheData(cacheKey, geocodeResponse);
				}

				const { results } = geocodeResponse.data;

				if (results.length > 0) {
					const { lat, lng } = results[0].geometry.location;
					setCustomerLoc({ lat, lng });

					if (customerId) {
						const infoResponse = await axios.post(
							"http://localhost:5000/api/places",
							{
								customerId: customerId.customer_id,
								latitude: lat,
								longitude: lng,
							}
						);

						setDriver(infoResponse.data.driver);
						setDirections(infoResponse.data.directions);
						setWalmartLocation(infoResponse.data.walmart_location);
						setEstimatedTime(infoResponse.data.estimated_time);
					}
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};
		// const delay = 2000;
		// let timer;

		if (customerId) {
			// timer = setTimeout(() => {
			fetchData();
			// }, delay);
		}

		// return () => clearTimeout(timer);
	}, [customerId, address]);

	console.log(driver);
	// // console.log(customerLoc);
	// // console.log(walmartLocation);
	// // console.log(directions);
	useEffect(() => {
		// Listen for the "driver_update" event
		function simulateDriverMovement() {
			console.log("simulate");
			const movementThreshold = 0.1;
			const movementSpeed = 2;
			const movementInterval = 10000;

			let driverLocation = {
				latitude: driver.location.latitude,
				longitude: driver.location.longitude,
			};

			const walmartLocationn = {
				latitude: walmartLocation.latitude,
				longitude: walmartLocation.longitude,
			};

			const customerLocation = {
				latitude: customerLoc.lat,
				longitude: customerLoc.lng,
			};

			let currentStage = 0;

			setInterval(() => {
				let targetLocation;
				if (currentStage === 0) {
					targetLocation = walmartLocationn;
				} else if (currentStage === 1) {
					targetLocation = customerLocation;
				}

				const distance = calculateDistance(
					driverLocation.latitude,
					driverLocation.longitude,
					targetLocation.latitude,
					targetLocation.longitude
				);

				if (distance <= movementThreshold) {
					if (currentStage === 0) {
						// Reached Walmart location precisely, move to the next stage
						currentStage = 1;
					} else {
						// Reached customer location, stop the interval
						return;
					}
				}
				driverLocation = moveTowards(
					driverLocation,
					targetLocation,
					movementSpeed
				);

				setDriver((prevDriver) => ({
					...prevDriver,
					location: {
						longitude: driverLocation.longitude,
						latitude: driverLocation.latitude,
					},
				}));
				// console.log(driver.location);
				// Emit the updated driver location to the server via websockets
				socket.emit("driver-location-update", {
					id: driver.id,
					driverLocation,
				});
			}, movementInterval);
		}
		if (driver && walmartLocation) {
			console.log("yes");
			simulateDriverMovement();
		}

		socket.on("driver-location-update", (updatedDriver) => {
			// Update the driver's data
			setDriver(updatedDriver);
		});
		//Clean up the event listener when the component unmounts
		return () => {
			socket.off("driver-location-update");
		};
	}, []); //

	useEffect(() => {
		return () => {
			socket.off("driver-location-update");
		};
	}, []);
	const containerStyle = {
		width: "400px",
		height: "400px",
	};
	const handleDirectionsToWalmartResponse = (response) => {
		//console.log(response);
		if (response !== null) {
			setDirectionsToWalmart(response);
		}
	};

	const handleDirectionsToPlaceResponse = (response) => {
		//console.log(response);
		if (response !== null) {
			setDirectionsToCustomer(response);
		}
	};
	const directionsToWalmartService = useMemo(() => {
		if (driver && walmartLocation) {
			return (
				<DirectionsService
					options={{
						origin: `${driver.location.latitude},${driver.location.longitude}`,
						destination: `${walmartLocation.latitude},${walmartLocation.longitude}`,
						travelMode: "DRIVING",
					}}
					callback={handleDirectionsToWalmartResponse}
				/>
			);
		}
		return null; // Return null if either `driver` or `walmartLocation` is falsy
	}, [driver, walmartLocation]);

	const directionsToCustomerService = useMemo(() => {
		if (customerLoc && walmartLocation) {
			return (
				<DirectionsService
					options={{
						origin: `${walmartLocation.latitude},${walmartLocation.longitude}`,
						destination: `${customerLoc.lat},${customerLoc.lng}`,
						travelMode: "DRIVING",
					}}
					callback={handleDirectionsToPlaceResponse}
				/>
			);
		}
		return null;
	}, [walmartLocation, customerLoc]);

	// const center = { lat: 40.7128, lng: -74.006 };

	// console.log("driver", driver);
	// console.log("walmartLocation", walmartLocation);
	// console.log(estimatedTime);

	const onLoad = (map) => {
		const bounds = new google.maps.LatLngBounds();

		const { lat, lng } = customerLoc; // Assuming `place` represents the marker's position
		bounds.extend({ lat, lng });
		map.fitBounds(bounds);
	};

	return (
		<div className="container" style={{ height: "100vh", width: "100%" }}>
			{!isLoaded ? (
				<h1>Loading...</h1>
			) : (
				<>
					{customerLoc && (
						<GoogleMap mapContainerStyle={containerStyle} onLoad={onLoad}>
							<Marker
								position={{ lat: customerLoc.lat, lng: customerLoc.lng }}
							/>
							{driver && driver.location && driver.name && (
								<Marker
									position={{
										lat: parseFloat(driver.location.latitude),
										lng: parseFloat(driver.location.longitude),
									}}
									icon={{
										url: carIcon,
										scaledSize: new window.google.maps.Size(40, 40),
									}}
								/>
							)}
							{walmartLocation && walmartLocation.name && (
								<Marker
									position={{
										lat: parseFloat(walmartLocation.latitude),
										lng: parseFloat(walmartLocation.longitude),
									}}
								/>
							)}
							{driver && walmartLocation && (
								<>
									{directionsToWalmartService}
									{directionsToCustomerService}
								</>
							)}

							{directionsToWalmart && (
								<DirectionsRenderer
									options={{
										directions: directionsToWalmart,
										suppressMarkers: true,
										polylineOptions: {
											strokeColor: "blue",
											strokeWeight: 4,
										},
									}}
								/>
							)}
							{directionsToCustomer && (
								<DirectionsRenderer
									options={{
										directions: directionsToCustomer,
										suppressMarkers: true,
										polylineOptions: {
											strokeColor: "red",
											strokeWeight: 4,
										},
									}}
								/>
							)}
						</GoogleMap>
					)}
				</>
			)}
			{driver && walmartLocation && (
				<OrderProgress
					orderProgress="Out for Delivery"
					carDetails={`${driver.car_model}, ${driver.license_plate}`}
					store={`${walmartLocation.name}`}
					storeAddress={`${walmartLocation.address}`}
					estimatedTime={estimatedTime}
					driverName={driver.name}
				/>
			)}
		</div>
	);
};
export default Map;
