import React, { useState, useEffect } from "react";
// import "./ProductDetails.css"; // Import your custom CSS file for styling
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { cartItemsAdded } from "./cartsSlice";
function ProductDetails() {
	const [product, setProduct] = useState(null);
	const id = window.location.pathname.split("/")[2];
	const dispatch = useDispatch();
	useEffect(() => {
		fetch(`http://localhost:5000/products/${id}`)
			.then((response) => response.json())
			.then((data) => {
				setProduct(data);
			})
			.catch((error) => console.error(error));
	}, [id]);

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
				// console.log(data);
			});
	};

	console.log(product);
	return (
		product && (
			<div
				className="product-details-container"
				style={{ height: "100vh", backgroundColor: "#EAF5EB" }}
			>
				<div className="product-details">
					<h2 className="product-title">{product.title}</h2>
					<h6 className="product-title">Brand: {product.brand}</h6>
					<p className="product-description">{product.description}</p>
					<p className="product-price">Price: $ {product.price.toFixed(2)}</p>
					<Button
						variant="primary"
						onClick={(e) => handleCart(e, product.id)}
						style={{ backgroundColor: "#08AC0A", color: "#FFFFFF" }}
						// style={{ marginRight: "2rem" }}
					>
						Add to Cart
					</Button>
				</div>
				<div className="product-images">
					<Row>
						<Col xs={6} md={4}>
							<Image
								src={product.images[2]}
								alt={product.title}
								rounded
								style={{
									borderStyle: "solid",
									borderWidth: "3px",
									marginRight: "50px",
									height: "400px",
									width: "400px",
									objectFit: "contain",
								}}
							/>
						</Col>
					</Row>
					{/* <img
						src={product.image}
						alt={product.title}
						className="product-image"
						style={{
							borderStyle: "solid",
							borderWidth: "3px",
							marginRight: "100px",
						}}
					></img> */}
				</div>
				<style>
					{`
					.product-details-container {
					  display: flex;
					  justify-content: space-between;
					  align-items: center;
					  padding: 20px;
					  background-color: #f5f5f5;
					}
		  
					.product-details {
					  flex: 1;
					  margin-right: 20px;
					}
		  
					.product-title {
					  font-size: 24px;
					  font-weight: bold;
					  margin-bottom: 10px;
					}
		  
					.product-description {
					  font-size: 16px;
					  margin-bottom: 20px;
					}
		  
					.product-price {
					  font-size: 18px;
					  font-weight: bold;
					}
		  
					.product-images {
					  flex: 1;
					  display: flex;
					  justify-content: flex-end;
					}
		  
					.product-image {
					  width: 200px;
					  height: auto;
					  margin-left: 10px;
					}
				  `}
				</style>
			</div>
		)
	);
}

export default ProductDetails;
