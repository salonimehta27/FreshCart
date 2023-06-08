// querySlice.js

import { createSlice } from "@reduxjs/toolkit";

const querySlice = createSlice({
	name: "query",
	initialState: [],
	reducers: {
		addQuery: (state, action) => {
			state.push(action.payload);
		},
		setQueries: (state, action) => {
			return action.payload; // Return the updated queries directly as the new state
		},
	},
});

export const { addQuery, setQueries } = querySlice.actions;

export default querySlice.reducer;
