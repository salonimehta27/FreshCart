import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./components/CustomerSide/productsSlice";
const store = configureStore({
	reducer: { products: productsReducer },
});
export default store;
