import { createSlice } from "@reduxjs/toolkit";
const storedAddress = localStorage.getItem("address");

const initialState = {
	entities: null,
	address: storedAddress ? JSON.parse(storedAddress) : null,
};
const loginSlice = createSlice({
	name: "currentUser",
	initialState,
	reducers: {
		currentUserAdded(state, action) {
			state.entities = action.payload;
		},
		currentUserRemoved(state) {
			state.entities = null;
		},
		currentAddress(state, action) {
			state.address = action.payload;
			localStorage.setItem("address", JSON.stringify(action.payload));
		},
	},
});

export const { currentUserAdded, currentUserRemoved, currentAddress } =
	loginSlice.actions;
export default loginSlice.reducer;
