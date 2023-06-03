import React from "react";
import Product from "./Product";
import { Card, Row, Col, Button, CardGroup } from "react-bootstrap";
import grocerybags from "../CustomerSide/images/grocerybags.jpg";
import delivery from "../CustomerSide/images/delivery.jpg";
import choice from "../CustomerSide/images/choice.jpg";
import updates from "../CustomerSide/images/updates.jpg";
import tracking from "../CustomerSide/images/tracking.jpg";
import "../CustomerSide/css/CardGroup.css";
const Home = () => {
	return (
		<div>
			<CardGroup className="custom-card-group">
				<Card className="custom-card">
					<Card.Body>
						<Card.Title className="custom-card-title">
							Choose what you want
						</Card.Title>
						<Card.Text>
							Browse through a wide selection of items from your preferred
							grocery stores at freshcart.com.
						</Card.Text>
					</Card.Body>
					<Card.Img variant="top" src={choice} className="custom-card-image" />
				</Card>
				<Card className="custom-card">
					<Card.Body>
						<Card.Title className="custom-card-title">
							See real-time updates
						</Card.Title>
						<Card.Text>
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
						<Card.Text>
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
			<Card
				style={{
					maxWidth: "500px",
					marginTop: "20px",
					margin: "0 auto",
					textAlign: "center",
					borderStyle: "none",
				}}
			>
				<Card.Body>
					<a href="/all-products">
						<Button
							style={{
								backgroundColor: "#0C6049",
								fontSize: "2rem",
								width: "70%",
								borderRadius: "5px",
								color: "#FFFFFF",
								boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
								transition: "background-color 0.3s ease",
								margin: "0 auto",
							}}
						>
							Shop Now
						</Button>
					</a>
					<Card.Text style={{ marginTop: "20px", fontSize: "1.2rem" }}>
						Start exploring our virtual aisles today and experience the joy of
						hassle-free grocery delivery.
					</Card.Text>
				</Card.Body>
			</Card>
			<Card
				style={{
					marginLeft: "50px",
					marginRight: "50px",
					textAlign: "center",
					borderStyle: "none",
				}}
			>
				<Card.Img
					variant="bottom"
					src={grocerybags}
					style={{
						width: "100%",
						maxHeight: "280px",
						objectFit: "fill",
						margin: "20px auto 0",
					}}
				/>
			</Card>

			{/* <Product /> */}
		</div>
	);
};

export default Home;

/*



			<Card
				className="bg-dark text-white"
				style={{
					marginTop: "30px",
					height: "500px",
					marginLeft: "30px",
					marginRight: "30px",
				}}
			>
				<Card.Img src={grocery5} alt="Card image" style={{ height: "500px" }} />
				<Card.ImgOverlay className="d-flex align-items-center justify-content-center">
					<div className="text-center">
						<Card.Title
							style={{
								color: "#0C6049",
								fontSize: "2rem", // Default font size
							}}
						>
							<b>Welcome to FreshCart!</b>
						</Card.Title>
						<Card.Text
							style={{
								color: "#0C6049",
								fontSize: "1.2rem", // Default font size
							}}
						>
							<br />
							// /* <i>
							// 	Start exploring our virtual aisles today and experience the joy
							// 	of hassle-free grocery delivery.
							// </i> */
// 	</Card.Text>
// 	<br />
// 	<a href="/all-products">
// 		<Button
// 			style={{
// 				backgroundColor: "#0C6049",
// 				fontSize: "2rem", // Default font size
// 				padding: "1rem 2rem",
// 				borderRadius: "5px",
// 				color: "#FFFFFF",
// 				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
// 				transition: "background-color 0.3s ease",
// 			}}
// 		>
// 			Shop Now
// 		</Button>
// 	</a>
// </div>
// <style>
// 					{`
//   @media (max-width: 640px) {
// 	.text-end {
// 	  margin-left: 0px; // Adjust the value as needed
// 	}
//   }
//   @media (max-width: 480px) {
// 	.text-end {
// 	  margin-left: 0px; // Adjust the value as needed
// 	}
//   }
//   `}
// 		</style>
// 	</Card.ImgOverlay>
// </Card>
