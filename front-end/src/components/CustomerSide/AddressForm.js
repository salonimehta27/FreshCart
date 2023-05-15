import React, { useState } from "react";
import { AddressElement } from "@stripe/react-stripe-js";

const AddressForm = ({ setAddress }) => {
	return (
		<form>
			<h3>Shipping</h3>
			<AddressElement
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
