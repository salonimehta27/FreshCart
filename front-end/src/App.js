import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Product from "./components/Product";
import ProductDetails from "./components/ProductDetails";

function App() {
	// const [flashMessage, setFlashMessage] = useState(null);

	// useEffect(() => {
	// 	// Check if flash message exists and display it
	// 	if (window.flashMessage) {
	// 		setFlashMessage(window.flashMessage);
	// 	}
	// }, []);

	return (
		<div className="App">
			<Router>
				<Navbar />
				{/* {flashMessage && <div className="flash-message">{flashMessage}</div>} */}
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/products" component={Product} />
					<Route path="/products/:id" component={ProductDetails} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
