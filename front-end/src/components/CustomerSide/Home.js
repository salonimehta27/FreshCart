import React from "react";
import Product from "./Product";

const Home = ({ products }) => {
	return (
		<div>
			{/* <h1>Welcome to Fresh Cart!</h1> */}
			<Product products={products} />
		</div>
	);
};

export default Home;
