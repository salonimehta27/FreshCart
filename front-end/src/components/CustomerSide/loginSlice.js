import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
	name: "currentUser",
	initialState: { entities: null },
	reducers: {
		currentUserAdded(state, action) {
			state.entities = action.payload;
		},
		currentUserRemoved(state) {
			state.entities = null;
		},
	},
});

export const { currentUserAdded, currentUserRemoved } = loginSlice.actions;
export default loginSlice.reducer;
