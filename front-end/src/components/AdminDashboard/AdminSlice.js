import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	entities: null,
};
const loginRepSlice = createSlice({
	name: "currentRep",
	initialState,
	reducers: {
		currentRepAdded(state, action) {
			state.entities = action.payload;
		},
		currentRepRemoved(state) {
			state.entities = null;
		},
	},
});

export const { currentRepAdded, currentRepRemoved } = loginRepSlice.actions;
export default loginRepSlice.reducer;
