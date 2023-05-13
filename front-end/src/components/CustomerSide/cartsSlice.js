import { createSlice } from "@reduxjs/toolkit";

const cartsSlice = createSlice({
	name: "carts",
	initialState: {
		items: [],
	},
	reducers: {
		cartItemsAdded(state, action) {
			state.items = action.payload;
		},
		cartItemsRemoved(state, action) {
			const index = state.items.cart_products.findIndex(
				(item) => item.id === action.payload
			);
			// may be needs to be items.cart_products
			state.items.cart_products.splice(index, 1);
		},
		cartItemsUpdated(state, action) {
			state.items = action.payload;
			// const { id, quantity } = action.payload;
			// console.log(state.items.cart_products);
			// const index = state.items.cart_products.findIndex(
			// 	(item) => item.id === id
			// );
			// console.log(index);
			// state.items.cart_products[index].quantity = quantity;
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
