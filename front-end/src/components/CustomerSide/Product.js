import { useEffect } from "react";
import { productsReceived } from "./productsSlice";
import { useSelector, useDispatch } from "react-redux";
import { cartItemsAdded, cartItemsUpdated } from "./cartsSlice";
import { Card, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
				// console.log(data);
			});
	};
	if (!products || !Array.isArray(products)) {
		return <p>No products found</p>;
	}

	return (
		<div>
			<h3>Products</h3>
			<Row xs={2} md={3} lg={4} className="g-4">
				{filteredProducts.map((product) => (
					<Col key={product.id}>
						<Card>
							<a href={`/products/${product.id}`}>
								<Card.Img
									variant="top"
									src={product.images[2]}
									alt={product.title}
									style={{ objectFit: "contain", height: "200px" }}
								/>
							</a>
							<Card.Body className="d-flex flex-column justify-content-between">
								<Card.Title
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									<Card.Title>
										<a
											href={`/products/${product.id}`}
											className="text-decoration-none"
										>
											<h5 className="text-dark">{product.title}</h5>
										</a>
									</Card.Title>
								</Card.Title>
								<Card.Text style={{ marginBottom: "1rem" }}>
									Price: $ {product.price.toFixed(2)}
								</Card.Text>
								<Button
									variant="primary"
									onClick={(e) => handleCart(e, product.id)}
									// style={{ marginRight: "2rem" }}
								>
									Add to Cart
								</Button>
								{/* <Button variant="outline-primary">Buy Now</Button> */}
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
}

export default Product;
