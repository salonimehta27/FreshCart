import React, { useState } from "react";
import { AddressElement } from "@stripe/react-stripe-js";

const AddressForm = ({ setAddress }) => {
	const address = {
		line1: "285 Fulton Street",
		line2: "",
		city: "New York",
		state: "NY",
		zip: "10007",
	};
	return (
		<form>
			<h3>Shipping</h3>
			<AddressElement
				value={address}
				onChange={(event) => {
					if (event.complete) {
						// Extract potentially complete address
						setAddress(event.value.address);
					}
				}}
				options={{ mode: "shipping" }}
			/>
			{/* <h3>Billing</h3>
			<AddressElement options={{ mode: "billing" }} /> */}
		</form>
	);
};

export default AddressForm;
