import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./components/CustomerSide/productsSlice";
import currentUserReducer from "./components/CustomerSide/loginSlice";
import cartsReducer from "./components/CustomerSide/cartsSlice";
import currentRepReducer from "./components/AdminDashboard/AdminSlice";
const store = configureStore({
	reducer: {
		products: productsReducer,
		currentUser: currentUserReducer,
		carts: cartsReducer,
		currentRep: currentRepReducer,
	},
});
export default store;
