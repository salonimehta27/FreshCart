import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
	name: "products",
	initialState: { entities: [], filteredEntities: [], reviews: [] },
	reducers: {
		productsReceived(state, action) {
			state.entities = action.payload;
			state.filteredEntities = action.payload;
		},
		productAdded(state, action) {
			state.entities.push(action.payload);
			state.filteredEntities.push(action.payload);
		},
		productFiltered(state, action) {
			const { searchQuery, categoryFilter } = action.payload;
			const newFilteredProducts = state.entities.filter((product) => {
				const matchedCategory =
					categoryFilter === "all" || product.category === categoryFilter;
				const matchedSearch = product.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				return matchedCategory && matchedSearch;
			});
			state.filteredEntities = newFilteredProducts;
		},
	},
});

export const { productsReceived, productAdded, productFiltered } =
	productsSlice.actions;
export default productsSlice.reducer;
