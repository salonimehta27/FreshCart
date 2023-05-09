import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Product() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/products")
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
			})
			.catch((error) => console.error(error));
	}, []);

	return (
		<div>
			<h2>Products</h2>
			{products.map((product) => (
				<div key={product.id}>
					<h3>
						<Link to={`/products/${product.id}`}>{product.title}</Link>
					</h3>
					<p>Price: {product.price}</p>
					<img src={product.image}></img>
				</div>
			))}
		</div>
	);
}

export default Product;
