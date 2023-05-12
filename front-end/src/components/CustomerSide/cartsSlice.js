import { createSlice } from "@reduxjs/toolkit";

const cartsSlice = createSlice({
	name: "carts",
	initialState: {
		items: [],
		products: [],
	},
	reducers: {
		cartItemsAdded(state, action) {
			state.items = action.payload;
			state.products = action.payload.products;
		},
		cartItemsRemoved(state, action) {
			const index = state.items.cart_products.findIndex(
				(item) => item.id === action.payload
			);
			state.items.splice(index, 1);
		},
		cartItemsUpdated(state, action) {
			const { id, quantity } = action.payload;
			const index = state.items.cart_products.findIndex(
				(item) => item.id === id
			);
			state.items[index].quantity = quantity;
		},
		cartItemsCleared(state) {
			state.items = [];
		},
	},
});

export const {
	cartItemsAdded,
	cartItemsRemoved,
	cartItemsUpdated,
	cartItemsCleared,
} = cartsSlice.actions;
export default cartsSlice.reducer;
