import { createSlice } from "@reduxjs/toolkit";

const cartsSlice = createSlice({
	name: "carts",
	initialState: {
		items: {},
		total: 0,
	},
	reducers: {
		cartItemsAdded(state, action) {
			state.items = action.payload;
		},
		cartItemsRemoved(state, action) {
			const index = state.items.cart_products.findIndex(
				(item) => item.product_id === action.payload
			);
			// may be needs to be items.cart_products
			state.items.cart_products.splice(index, 1);
		},
		cartItemsUpdated(state, action) {
			const { id, quantity } = action.payload;
			const index = state.items.cart_products.findIndex(
				(item) => item.product_id === id
			);
			state.items.cart_products[index].quantity = quantity;
		},
		cartItemsCleared(state) {
			state.items = {};
		},

		cartTotal(state, action) {
			state.total = action.payload;
		},
	},
});

export const {
	cartItemsAdded,
	cartItemsRemoved,
	cartItemsUpdated,
	cartItemsCleared,
	cartTotal,
} = cartsSlice.actions;
export default cartsSlice.reducer;