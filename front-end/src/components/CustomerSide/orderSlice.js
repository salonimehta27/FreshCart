import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
	name: "order",
	initialState: {
		currentOrder: null,
		allOrders: [],
	},
	reducers: {
		setOrder: (state, action) => {
			state.currentOrder = action.payload;
		},
		setAllOrders: (state, action) => {
			state.allOrders = action.payload;
		},
	},
});

export const { setOrder, clearOrder, setAllOrders } = orderSlice.actions;
export default orderSlice.reducer;
