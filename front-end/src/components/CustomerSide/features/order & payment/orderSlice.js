import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
	name: "order",
	initialState: {
		currentOrder: null,
		allOrders: [],
		clientSecret: null,
	},
	reducers: {
		setOrder: (state, action) => {
			state.currentOrder = action.payload;
		},
		setAllOrders: (state, action) => {
			state.allOrders = action.payload;
		},
		storeClientSecret: (state, action) => {
			state.clientSecret = action.payload;
		},
	},
});

export const { setOrder, clearOrder, setAllOrders, storeClientSecret } =
	orderSlice.actions;
export default orderSlice.reducer;
