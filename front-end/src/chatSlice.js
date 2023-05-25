import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
	name: "chat",
	initialState: {
		messages: [],
	},
	reducers: {
		loadChatMessages: (state, action) => {
			state.messages = action.payload;
		},

		addChatMessage: (state, action) => {
			state.messages.push(action.payload);
		},
	},
});

export const { loadChatMessages, addChatMessage } = chatSlice.actions;

export default chatSlice.reducer;
