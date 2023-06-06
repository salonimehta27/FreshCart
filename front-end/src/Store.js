import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./components/CustomerSide/features/product/productsSlice";
import currentUserReducer from "./components/CustomerSide/features/account/loginSlice";
import cartsReducer from "./components/CustomerSide/features/order & payment/cartsSlice";
import currentRepReducer from "./components/AdminDashboard/AdminSlice";
import queryReducer from "./components/AdminDashboard//querySlice";
import chatReducer from "./chatSlice";
import adminChatReducer from "./components/AdminDashboard/adminChatSlice";
import mapReducer from "./components/CustomerSide/features/order & payment/mapSlice";
import orderReducer from "./components/CustomerSide/features/order & payment/orderSlice";

const store = configureStore({
	reducer: {
		products: productsReducer,
		currentUser: currentUserReducer,
		carts: cartsReducer,
		currentRep: currentRepReducer,
		chat: chatReducer,
		adminChat: adminChatReducer,
		map: mapReducer,
		order: orderReducer,
		query: queryReducer,
	},
});

export default store;
