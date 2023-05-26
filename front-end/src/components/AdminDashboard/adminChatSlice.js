import { createSlice } from "@reduxjs/toolkit";

const adminChatSlice = createSlice({
	name: "adminChat",
	initialState: {
		messages: [],
		chat_id: 0,
	},
	reducers: {
		loadAdminChatMessages: (state, action) => {
			state.messages = action.payload;
		},

		addAdminChatMessage: (state, action) => {
			state.messages.push(action.payload);
		},
		setChatId(state, action) {
			state.chat_id = action.payload;
		},
	},
});

export const { loadAdminChatMessages, setChatId, addAdminChatMessage } =
	adminChatSlice.actions;

export default adminChatSlice.reducer;
