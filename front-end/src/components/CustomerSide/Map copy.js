import React, { useEffect, useState } from "react";

const Map = () => {
	const [map, setMap] = useState(null);

	useEffect(() => {
		// load the Google Maps API
		const script = document.createElement("script");
		script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
		document.head.appendChild(script);

		// initialize the map
		script.onload = () => {
			const map = new window.google.maps.Map(document.getElementById("map"), {
				center: { lat: 37.7749, lng: -122.4194 },
				zoom: 8,
			});
			setMap(map);
		};
	}, []);

	return <div id="map" style={{ height: "400px" }}></div>;
};

export default Map;
