// mapSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	customerLocation: null,
	driver: null,
	walmartLocation: null,
	estimatedTime: null,
	directions: null,
	directionsToWalmart: null,
	directionsToCustomer: null,
};

const mapSlice = createSlice({
	name: "map",
	initialState,
	reducers: {
		setCustomerLocation: (state, action) => {
			state.customerLocation = action.payload;
		},
		setDriver: (state, action) => {
			state.driver = action.payload;
		},
		setWalmartLocation: (state, action) => {
			state.walmartLocation = action.payload;
		},
		setEstimatedTime: (state, action) => {
			state.estimatedTime = action.payload;
		},
		setDirections: (state, action) => {
			state.directions = action.payload;
		},
		setDirectionsToWalmart: (state, action) => {
			state.directionsToWalmart = action.payload;
		},
		setDirectionsToCustomer: (state, action) => {
			state.directionsToCustomer = action.payload;
		},
	},
});

export const {
	setCustomerLocation,
	setEstimatedTime,
	setDriver,
	setWalmartLocation,
	setDirections,
	setDirectionsToCustomer,
	setDirectionsToWalmart,
} = mapSlice.actions;

export default mapSlice.reducer;
