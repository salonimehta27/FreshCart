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
			return action.payload;
		},
	},
});

export const { addQuery, setQueries } = querySlice.actions;

export default querySlice.reducer;
