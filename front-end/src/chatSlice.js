import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
	name: "chat",
	initialState: {
		messages: [],
		chatId: null,
	},
	reducers: {
		loadChatMessages: (state, action) => {
			state.messages = action.payload;
		},

		addChatMessage: (state, action) => {
			state.messages.push(action.payload);
		},
		setChatId(state, action) {
			state.chatId = action.payload;
		},
		clearChat(state) {
			state.messages = [];
		},
	},
});

export const { loadChatMessages, addChatMessage, clearChat } =
	chatSlice.actions;

export default chatSlice.reducer;
