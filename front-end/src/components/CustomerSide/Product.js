import { useEffect } from "react";
import { productsReceived } from "./productsSlice";
import { useSelector, useDispatch } from "react-redux";

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
				</div>
			))}
		</div>
	);
}

export default Product;
