import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { useSelector } from "react-redux";

const Map = () => {
	const [place, setPlace] = useState(null);
	const customerId = useSelector((state) => state.currentUser.entities);
	const address = useSelector((state) => state.currentUser.address);
	const [driver, setDriver] = useState(null);
	console.log(customerId);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const geocodeResponse = await axios.get(
					`https://maps.googleapis.com/maps/api/geocode/json?address=${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				);

				const { results } = geocodeResponse.data;

				if (results.length > 0) {
					const { lat, lng } = results[0].geometry.location;
					setPlace({ lat, lng });

					if (customerId) {
						const driverResponse = await axios.post(
							"http://localhost:5000/api/places",
							{
								customerId: customerId.customer_id,
								latitude: lat,
								longitude: lng,
							}
						);

						setDriver(driverResponse.data);
					}
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		const delay = 2000;
		let timer;

		if (customerId) {
			timer = setTimeout(() => {
				fetchData();
			}, delay);
		}

		return () => clearTimeout(timer);
	}, [customerId, address]);

	// console.log(place);
	console.log("driver", driver);
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
