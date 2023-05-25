import { createSlice } from "@reduxjs/toolkit";

const adminChatSlice = createSlice({
	name: "adminChat",
	initialState: {
		messages: [],
	},
	reducers: {
		loadAdminChatMessages: (state, action) => {
			state.messages = action.payload;
		},

		addAdminChatMessage: (state, action) => {
			state.messages.push(action.payload);
		},
	},
});

export const { loadAdminChatMessages, addAdminChatMessage } =
	adminChatSlice.actions;

export default adminChatSlice.reducer;
