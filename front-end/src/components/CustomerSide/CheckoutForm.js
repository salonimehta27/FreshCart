import React, { useEffect, useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { cartItemsCleared } from "./cartsSlice";
import { useNavigate } from "react-router-dom";
import { currentAddress } from "./loginSlice";

export default function CheckoutForm({ cartItems, address }) {
	//console.log(cartItems);
	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	//console.log(address);
	function formatData(cartData) {
		const orderData = {
			customer_id: cartData.customer_id,
			order_items: [],
		};
		cartData.cart_products.forEach((item) => {
			const product = cartData.products.find((p) => p.id === item.product_id);
			if (product) {
				const totalPrice = (item.quantity * product.price).toFixed(2);
				orderData.order_items.push({
					product_id: product.id,
					quantity: item.quantity,
					price: Number(totalPrice),
				});
			}
		});
		return orderData;
	}
	// console.log(formatData(cartItems));
	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get(
			"payment_intent_client_secret"
		);

		if (!clientSecret) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case "succeeded":
					setMessage("Payment succeeded!");
					break;
				case "processing":
					setMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					setMessage("Your payment was not successful, please try again.");
					break;
				default:
					setMessage("Something went wrong.");
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		fetch("http://localhost:5000/submit_order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formatData(cartItems)),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
				dispatch(cartItemsCleared());
				dispatch(currentAddress(address));
				localStorage.setItem("address", JSON.stringify(address));
				navigate(`/order_success`);
			})
			.catch((error) => {
				console.error("Error:", error);
			});

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: "http://localhost:3000/order_success",
				receipt_email: email,
			},
		});

		if (error) {
			setMessage(error.message);
			setIsLoading(false);
			return;
		}

		// Payment successful
	};
	const paymentElementOptions = {
		layout: "tabs",
	};

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" options={paymentElementOptions} />
			<button disabled={isLoading || !stripe || !elements} id="submit">
				<span id="button-text">
					{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
				</span>
			</button>
			{/* Show any error or success messages */}
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
}
