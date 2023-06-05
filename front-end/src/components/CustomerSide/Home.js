import React from "react";
import Product from "./features/product/Product";
import { Card, Row, Col, Button, CardGroup } from "react-bootstrap";
import grocerybags from "../CustomerSide/images/grocerybags.jpg";
import delivery from "../CustomerSide/images/delivery.jpg";
import choice from "../CustomerSide/images/choice.jpg";
import updates from "../CustomerSide/images/updates.jpg";
import tracking from "../CustomerSide/images/tracking.jpg";
import banner10 from "../CustomerSide/images/banner10-min.png";
import "../CustomerSide/css/CardGroup.css";
const Home = () => {
	return (
		<div>
			<Card className="bg-dark text-black">
				<Card.Img
					variant="bottom"
					src={banner10}
					style={{
						width: "100%",
						maxHeight: "400px",
					}}
				/>
				<Card.ImgOverlay>
					<Card.Text
						className="card-heading"
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							textAlign: "center",
							width: "90%",
							maxWidth: "600px",
							padding: "10px",
						}}
					>
						Start exploring our virtual aisles today and experience the joy of
						hassle-free grocery delivery.
					</Card.Text>

					<a href="/all-products" style={{ textDecoration: "none" }}>
						<Button
							style={{
								backgroundColor: "#0C6049",
								fontSize: "1.5rem",
								width: "50%",
								borderRadius: "5px",
								color: "#FFFFFF",
								boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
								transition: "background-color 0.3s ease",
								display: "block",
								margin: "20px auto 0",
								maxWidth: "300px",
							}}
						>
							Shop Now
						</Button>
					</a>
				</Card.ImgOverlay>
			</Card>

			<CardGroup className="custom-card-group">
				<Card className="custom-card">
					<Card.Body>
						<Card.Title className="custom-card-title">
							Choose what you want
						</Card.Title>
						<Card.Text className="cards">
							Select items from your favorite grocery stores at freshcart.com .
						</Card.Text>
					</Card.Body>
					<Card.Img variant="top" src={choice} className="custom-card-image" />
				</Card>
				<Card className="custom-card">
					<Card.Body>
						<Card.Title className="custom-card-title">
							See real-time updates
						</Card.Title>
						<Card.Text className="cards">
							Personal shoppers pick items with care. Chat as they shop and
							manage your order.
						</Card.Text>
					</Card.Body>
					<Card.Img
						variant="top"
						src={tracking}
						className="custom-card-image"
					/>
				</Card>

				<Card className="custom-card">
					<Card.Body>
						<Card.Title className="custom-card-title">
							Get your items same-day
						</Card.Title>
						<Card.Text className="cards">
							Pick a convenient time for you. Enjoy FreshCart’s 100% quality
							guarantee on every order.
						</Card.Text>
					</Card.Body>
					<Card.Img
						variant="top"
						src={delivery}
						className="custom-card-image"
					/>
				</Card>
			</CardGroup>
		</div>
	);
};

export default Home;
