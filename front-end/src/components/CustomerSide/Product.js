import { useEffect } from "react";
import { productsReceived } from "./productsSlice";
import { useSelector, useDispatch } from "react-redux";
import { cartItemsAdded, cartItemsUpdated } from "./cartsSlice";

function Product() {
	const dispatch = useDispatch();
	const products = useSelector((state) => state.products.entities);
	const filteredProducts = useSelector(
		(state) => state.products.filteredEntities
	);

	useEffect(() => {
		fetch("http://localhost:5000/products")
			.then((response) => response.json())
			.then((data) => {
				dispatch(productsReceived(data));
			})
			.catch((error) => console.error(error));
	}, []);

	const handleCart = (e, product_id) => {
		e.preventDefault();
		fetch("http://localhost:5000/add_to_cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ product_id: product_id, quantity: 1 }),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(cartItemsAdded(data));
				// dispatch(cartItemsUpdated(data));
				console.log(data);
			});
	};
	if (!products || !Array.isArray(products)) {
		return <p>No products found</p>;
	}

	return (
		<div>
			<h2>Products</h2>
			{filteredProducts.map((product) => (
				<div key={product.id}>
					<h3>
						<a href={`/products/${product.id}`}>{product.title}</a>
					</h3>
					<p>Price: {product.price}</p>
					<img src={product.image} alt={product.title} />
					<button onClick={(e) => handleCart(e, product.id)}>
						Add to Cart
					</button>
				</div>
			))}
		</div>
	);
}

export default Product;
