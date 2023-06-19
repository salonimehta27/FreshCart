/*global google*/
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GoogleMap,
	Marker,
	useLoadScript,
	DirectionsRenderer,
	DirectionsService,
} from "@react-google-maps/api";
import axios from "axios";
import OrderProgress from "./OrderProgress";
import socket from "../../../../socket";
import walmart from "../../images/walmart.jpeg";
import { FaCar } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

import { setWalmartLocation, setDriver, setCustomerLocation } from "./mapSlice";
import { renderToString } from "react-dom/server";
import { setOrder } from "./orderSlice";
import delivered from "../../images/delivered.jpg";

const MapComponent = () => {
	const customerId = useSelector((state) => state.currentUser.entities);
	const address = useSelector((state) => state.currentUser.address);
	const driver = useSelector((state) => state.map.driver);
	const walmartLocation = useSelector((state) => state.map.walmartLocation);
	const [estimatedTimeToWalmart, setEstimatedTimeToWalmart] = useState(0);
	const [estimatedTimeToCustomer, setEstimatedTimeToCustomer] = useState(0);

	const directions = useSelector((state) => state.map.directions);
	const customerLoc = useSelector((state) => state.map.customerLocation);
	const [directionsToWalmart, setDirectionsToWalmart] = useState(null);
	const [directionsToCustomer, setDirectionsToCustomer] = useState(null);
	const [reachedCustomer, setReachedCustomer] = useState(false);
	const [reachedWalmart, setReachedWalmart] = useState(false);
	const [showMarker, setShowMarker] = useState(false);
	const orderValue = localStorage.getItem("order");
	const order = JSON.parse(orderValue);
	const dispatch = useDispatch();

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const geocodeResponse = await axios.get(
					`https://maps.googleapis.com/maps/api/geocode/json?address=${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				);

				const { results } = geocodeResponse.data;

				if (results.length > 0) {
					const { lat, lng } = results[0].geometry.location;
					dispatch(setCustomerLocation({ lat, lng }));

					if (customerId) {
						const infoResponse = await axios.post(
							"http://localhost:5000/api/places",
							{
								customerId: customerId.customer_id,
								latitude: lat,
								longitude: lng,
							}
						);
						//console.log(infoResponse.data.directionsToWalmart);
						dispatch(setWalmartLocation(infoResponse.data.walmart_location));
						dispatch(setDriver(infoResponse.data.driver));
						setShowMarker(true);
					}
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		if (customerId) {
			fetchData();
		}
	}, [customerId, address]);

	// console.log(customerLoc);
	const containerStyle = {
		width: "400px",
		height: "400px",
	};
	// Helper function to calculate the distance between two locations using the Haversine formula
	function toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

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

		// Calculate the differences in latitude and longitude
		const dlat = lat2 - lat1;
		const dlon = lon2 - lon1;

		const a =
			Math.sin(dlat / 2) * Math.sin(dlat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distance in kilometers

		return distance;
	}

	function calculateBearing(location1, location2) {
		const lat1 = toRadians(location1.latitude || location1.lat);
		const lon1 = toRadians(location1.longitude || location1.lng);
		const lat2 = toRadians(location2.latitude || location2.lat);
		const lon2 = toRadians(location2.longitude || location2.lng);

		const dlon = lon2 - lon1;

		const y = Math.sin(dlon) * Math.cos(lat2);
		const x =
			Math.cos(lat1) * Math.sin(lat2) -
			Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);

		const bearing = (Math.atan2(y, x) * 180) / Math.PI; // Bearing in degrees

		return (bearing + 360) % 360; // Normalize bearing to a value between 0 and 360 degrees
	}

	function calculateNextLocation(currentLocation, distance, bearing) {
		const R = 6371; // Radius of the Earth in kilometers
		const d = distance / R; // Distance in radians

		const lat1 = toRadians(currentLocation.latitude || currentLocation.lat);
		const lon1 = toRadians(currentLocation.longitude || currentLocation.lng);
		const brng = toRadians(bearing);

		const lat2 = Math.asin(
			Math.sin(lat1) * Math.cos(d) +
				Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
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

	// Helper function to convert radians to degrees
	function toDegrees(radians) {
		return radians * (180 / Math.PI);
	}

	useEffect(() => {
		let currentStepIndex = 0; // Initial step index is 0

		if (
			directionsToWalmart &&
			reachedCustomer === false &&
			order &&
			order.order_status === null
		) {
			const timer = setInterval(() => {
				const currentStep =
					directionsToWalmart.routes[0].legs[0].steps[currentStepIndex];

				const startLocation = {
					lat: currentStep.start_location.lat(),
					lng: currentStep.start_location.lng(),
				};

				const endLocation = {
					lat: currentStep.end_location.lat(),
					lng: currentStep.end_location.lng(),
				};

				// Calculate the distance and bearing between the start and end locations
				const distance = calculateDistance(startLocation, endLocation);
				const bearing = calculateBearing(startLocation, endLocation);

				// Calculate the next location based on the current location, distance, and bearing
				const nextLocation = calculateNextLocation(
					driver.location,
					distance,
					bearing
				);

				// Emit the updated driver location to the server
				socket.emit("driver-location-update", {
					id: driver.id,
					driverLocation: nextLocation,
				});

				// Check if reached the end of directionsToWalmart
				if (
					currentStepIndex >=
					directionsToWalmart.routes[0].legs[0].steps.length - 1
				) {
					clearInterval(timer); // Stop the timer as the driver has reached the end of directionsToWalmart
					setReachedWalmart(true);

					let customerStepIndex = 0; // Initial step index for directionsToCustomer is 0
					let customerStartLocation = {
						lat: endLocation.lat,
						lng: endLocation.lng,
					}; // Starting location for directionsToCustomer is the end location of the last step in directionsToWalmart

					const customerTimer = setInterval(() => {
						const customerStep =
							directionsToCustomer.routes[0].legs[0].steps[customerStepIndex];

						const customerEndLocation = {
							lat: customerStep.end_location.lat(),
							lng: customerStep.end_location.lng(),
						};

						// Calculate the distance and bearing between the start and end locations for directionsToCustomer
						const customerDistance = calculateDistance(
							customerStartLocation,
							customerEndLocation
						);
						const customerBearing = calculateBearing(
							customerStartLocation,
							customerEndLocation
						);

						// Calculate the next location based on the current location, distance, and bearing for directionsToCustomer
						const customerNextLocation = calculateNextLocation(
							customerStartLocation,
							customerDistance,
							customerBearing
						);

						// Emit the updated driver location to the server
						socket.emit("driver-location-update", {
							id: driver.id,
							driverLocation: customerNextLocation,
						});

						// Check if reached the end of directionsToCustomer
						if (
							customerStepIndex >=
							directionsToCustomer.routes[0].legs[0].steps.length - 1
						) {
							clearInterval(customerTimer); // Stop the timer as the driver has reached the end of directionsToCustomer
							clearInterval(timer); // Stop the timer completely as the driver has reached the customer
							setTimeout(() => {
								setReachedCustomer(true);
								const data = {
									order_id: order.id,
									driver_id: driver.id,
									address: address,
								};
								fetch("http://localhost:5000/update-order-status", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(data),
								})
									.then((response) => response.json())
									.then((data) => {
										localStorage.setItem("order", JSON.stringify(data.order));
										dispatch(setOrder(data.order));
									})
									.catch((error) => {
										console.error(error);
									});
							}, 500);

							return;
						}

						// Increment the step index for directionsToCustomer
						customerStepIndex++;
						// Set the start location for the next step as the end location of the current step
						customerStartLocation = customerEndLocation;
					}, 1000);
					return () => {
						clearInterval(customerTimer); // Stop the inner timer when the component unmounts or when directionsToCustomer changes
					};
				}

				// Increment the step index for directionsToWalmart
				currentStepIndex++;
			}, 1000);
			return () => {
				// Cleanup the timer when the component unmounts or when directionsToWalmart is completed
				clearInterval(timer);
			};
		}
	}, [driver, directionsToCustomer, directionsToWalmart]);

	useEffect(() => {
		socket.on("driver_location_updated", (updatedDriver) => {
			//console.log("updated", updatedDriver);
			dispatch(setDriver(updatedDriver.driver_data));
			//dispatch(setDirections(updatedDriver.directions.directions));
		});
		return () => {
			socket.off("driver_location_updated");
		};
	}, []);
	const handleDirectionsToWalmartResponse = (response) => {
		//console.log(response);
		if (response !== null) {
			setDirectionsToWalmart(response);
			const durationToWalmart = response.routes[0].legs[0].duration.value; // Duration in seconds
			setEstimatedTimeToWalmart(durationToWalmart / 60); // Convert to minutes and update estimated time to Walmart
		}
	};

	const handleDirectionsToPlaceResponse = (response) => {
		//console.log(response);
		if (response !== null) {
			setDirectionsToCustomer(response);
			const durationToCustomer = response.routes[0].legs[0].duration.value; // Duration in seconds
			setEstimatedTimeToCustomer(durationToCustomer / 60); // Convert to minutes and update estimated time to the customer
		}
	};

	const totalEstimatedTime = estimatedTimeToWalmart + estimatedTimeToCustomer;

	const directionsToWalmartService = useMemo(() => {
		if (driver && walmartLocation) {
			return (
				<DirectionsService
					options={{
						origin: `${driver.location.latitude},${driver.location.longitude}`,
						destination: `${walmartLocation.latitude},${walmartLocation.longitude}`,
						travelMode: google?.maps?.TravelMode?.DRIVING,
					}}
					callback={handleDirectionsToWalmartResponse}
				/>
			);
		}
		return null;
	}, [driver, walmartLocation]);
	//console.log(directionsToCustomer);
	const directionsToCustomerService = useMemo(() => {
		if (walmartLocation && customerLoc) {
			//const destination = `${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`;
			//console.log(customerLoc);
			return (
				<DirectionsService
					options={{
						origin: `${walmartLocation.latitude},${walmartLocation.longitude}`,
						destination: `${customerLoc.lat},${customerLoc.lng}`,
						travelMode: google?.maps?.TravelMode?.DRIVING,
					}}
					callback={handleDirectionsToPlaceResponse}
				/>
			);
		}
		return null;
	}, [walmartLocation, customerLoc]);

	const onLoad = (map) => {
		const bounds = new google.maps.LatLngBounds();

		if (customerLoc) {
			const { lat, lng } = customerLoc;
			bounds.extend({ lat, lng });
			map.fitBounds(bounds);
		}
	};
	const mapOptions = {
		styles: [
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [
					{
						color: "#a2daf2",
					},
				],
			},
			{
				featureType: "landscape.man_made",
				elementType: "geometry",
				stylers: [
					{
						color: "#f7f1df",
					},
				],
			},
			{
				featureType: "landscape.natural",
				elementType: "geometry",
				stylers: [
					{
						color: "#d0e3b4",
					},
				],
			},
			{
				featureType: "landscape.natural.terrain",
				elementType: "geometry",
				stylers: [
					{
						visibility: "off",
					},
				],
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [
					{
						color: "#bde6ab",
					},
				],
			},
			// Additional styles
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
			{
				featureType: "road",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#808080",
					},
				],
			},
			{
				featureType: "road",
				elementType: "labels.text.stroke",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
			{
				featureType: "transit",
				elementType: "geometry",
				stylers: [
					{
						color: "#f2f2f2",
					},
				],
			},
			{
				featureType: "transit.station",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
			{
				featureType: "transit.station",
				elementType: "labels.text.stroke",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
			{
				featureType: "administrative",
				elementType: "geometry",
				stylers: [
					{
						visibility: "off",
					},
				],
			},
			{
				featureType: "administrative.land_parcel",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#bdbdbd",
					},
				],
			},
			{
				featureType: "administrative.neighborhood",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#808080",
					},
				],
			},
			{
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#808080",
					},
				],
			},
			{
				featureType: "poi",
				elementType: "labels.text.stroke",
				stylers: [
					{
						color: "#ffffff",
					},
				],
			},
		],
	};

	return (
		<>
			<div
				className="container"
				style={{
					height: "100vh",
					width: "100%",
					border: "1px solid #ccc",
					marginTop: "10px",
					boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
				}}
			>
				{!isLoaded ? (
					<h1>Loading...</h1>
				) : order.order_status !== "DELIVERED" ? (
					<>
						{order && order.order_status === null && (
							<div style={{ textAlign: "center", marginTop: "20px" }}>
								<h2>Your order was successful!</h2>
								<p>
									We have connected you with the nearest driver. They will
									contact you shortly to confirm your delivery details.
								</p>
							</div>
						)}
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "45vh",
							}}
						>
							<GoogleMap
								mapContainerStyle={{ width: "80%", height: "100%" }}
								onLoad={onLoad}
								options={mapOptions}
							>
								{showMarker && customerLoc && (
									<>
										<Marker
											position={{
												lat: parseFloat(customerLoc.lat),
												lng: parseFloat(customerLoc.lng),
											}}
											icon={{
												url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
													renderToString(<FaUser color="red" size={40} />)
												)}`,
												scaledSize: new window.google.maps.Size(40, 40),
											}}
										/>

										<Marker
											position={{
												lat: parseFloat(driver.location.latitude),
												lng: parseFloat(driver.location.longitude),
											}}
											icon={{
												url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
													renderToString(<FaCar color="blue" size={40} />)
												)}`,
												scaledSize: new window.google.maps.Size(40, 40),
											}}
										/>
										<Marker
											position={{
												lat: parseFloat(walmartLocation.latitude),
												lng: parseFloat(walmartLocation.longitude),
											}}
											icon={{
												url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
													renderToString(
														<FaShoppingCart color="green" size={40} />
													)
												)}`,
												scaledSize: new window.google.maps.Size(40, 40),
											}}
										/>
									</>
								)}

								{order &&
									order.order_status === null &&
									directionsToWalmartService}
								{order &&
									order.order_status === null &&
									directionsToCustomerService}
								{order && order.order_status === null && directionsToWalmart && (
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
								{order && order.order_status === null && directionsToCustomer && (
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
						</div>
					</>
				) : (
					<div className="card border-0 text-center">
						<div className="card-body">
							<>
								<h3>Your order has been delivered!!</h3>
								<img
									src={delivered}
									alt="delivered"
									className="mx-auto d-block"
								/>
							</>
						</div>
					</div>
				)}
				{driver && walmartLocation && (
					<OrderProgress
						orderProgress={
							(order && order.order_status === "DELIVERED") ||
							(reachedWalmart && reachedCustomer)
								? "Delivered"
								: reachedWalmart
								? "Driver has picked the grocery and is on their way"
								: "Driver is on their way to pick groceries"
						}
						orderNumber={order && order.id}
						orderDate={order && order.created_at}
						carDetails={`${driver.car_model}, ${driver.license_plate}`}
						store={`${walmartLocation.name}`}
						storeAddress={`${walmartLocation.address}`}
						estimatedTime={`${totalEstimatedTime.toFixed(2)} mins`}
						driverName={driver.name}
					/>
				)}
			</div>
		</>
	);
};

export default MapComponent;
