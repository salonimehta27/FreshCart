import { useState, useEffect } from "react";

function Product({ products }) {
	if (!products || !Array.isArray(products)) {
		return <p>No products found</p>;
	}
	return (
		<div>
			<h2>Products</h2>
			{products.map((product) => (
				<div key={product.id}>
					<h3>
						<a href={`/products/${product.id}`}>{product.title}</a>
					</h3>
					<p>Price: {product.price}</p>
					<img src={product.image}></img>
				</div>
			))}
		</div>
	);
}

export default Product;
