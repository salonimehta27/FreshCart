import React, { useState, useEffect } from "react";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddressForm from "./AddressForm";
function PaymentForm({ cartItems }) {
	const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);
	const [clientSecret, setClientSecret] = useState("");
	const [address, setAddress] = useState(null);
	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		fetch("http://localhost:5000/create-payment-intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items: cartItems }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, []);

	const appearance = {
		theme: "stripe",
		variables: {
			colorBackground: "#b2e1c0",
		},
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div className="container">
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<AddressForm setAddress={setAddress} />
					<CheckoutForm cartItems={cartItems} address={address} />
				</Elements>
			)}
		</div>
	);
}

export default PaymentForm;
