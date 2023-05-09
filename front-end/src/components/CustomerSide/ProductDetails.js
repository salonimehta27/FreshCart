import { useState, useEffect } from "react";

function ProductDetails() {
	const [product, setProduct] = useState({});
	const id = window.location.pathname.split("/")[2];
	useEffect(() => {
		fetch(`http://localhost:5000/products/${id}`)
			.then((response) => response.json())
			.then((data) => {
				setProduct(data);
			})
			.catch((error) => console.error(error));
	}, [id]);
	console.log(product);
	return (
		<div>
			<h2>{product.title}</h2>
			<p>{product.description}</p>
			<p>Price: {product.price}</p>
			{product &&
				product.images &&
				product.images.map((image) => (
					<img src={image} alt="product image"></img>
				))}
		</div>
	);
}

export default ProductDetails;
