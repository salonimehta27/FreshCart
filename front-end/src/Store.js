import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./components/CustomerSide/productsSlice";
import currentUserReducer from "./components/CustomerSide/loginSlice";
import cartsReducer from "./components/CustomerSide/cartsSlice";
import currentRepReducer from "./components/AdminDashboard/AdminSlice";
import chatReducer from "./chatSlice";
import adminChatReducer from "./components/AdminDashboard/adminChatSlice";
import mapReducer from "./components/CustomerSide/mapSlice";

const store = configureStore({
	reducer: {
		products: productsReducer,
		currentUser: currentUserReducer,
		carts: cartsReducer,
		currentRep: currentRepReducer,
		chat: chatReducer,
		adminChat: adminChatReducer,
		map: mapReducer,
	},
});

export default store;
