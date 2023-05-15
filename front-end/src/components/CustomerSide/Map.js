import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { useSelector } from "react-redux";

const Map = () => {
	const [place, setPlace] = useState(null);
	const customerId = useSelector((state) => state.currentUser.entities);
	const address = useSelector((state) => state.currentUser.address);
	//console.log(customerId);
	useEffect(() => {
		// Geocode the address and fetch the latitude and longitude
		const geocodeAddress = async () => {
			try {
				const response = await axios.get(
					`https://maps.googleapis.com/maps/api/geocode/json?address=${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				);

				const { results } = response.data;

				if (results.length > 0) {
					const { lat, lng } = results[0].geometry.location;
					// Store the latitude and longitude in the places state
					setPlace({ lat, lng });
				}
			} catch (error) {
				console.error("Error geocoding address:", error);
			}

			await axios.post("http://localhost:5000/api/places", {
				customerId: customerId.customer_id,
				latitude: place.lat,
				longitude: place.lng,
			});
		};

		geocodeAddress();
	}, [address]);
	// console.log(place);
	return (
		<div className="container" style={{ height: "100vh", width: "100%" }}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
				defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
				defaultZoom={10}
			>
				{place && (
					<Marker lat={place.lat} lng={place.lng} name={address.line1} />
				)}
			</GoogleMapReact>
		</div>
	);
};

const Marker = ({ name }) => <div>{name}</div>;

export default Map;
