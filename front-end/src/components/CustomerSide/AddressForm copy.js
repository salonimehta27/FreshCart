import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddressForm = () => {
	const [shippingAddress, setShippingAddress] = useState({
		name: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zip: "",
	});
	const [billingAddress, setBillingAddress] = useState({
		name: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zip: "",
	});

	const handleShippingAddressChange = (event) => {
		const { name, value } = event.target;
		setShippingAddress({ ...shippingAddress, [name]: value });
	};

	const handleBillingAddressChange = (event) => {
		const { name, value } = event.target;
		setBillingAddress({ ...billingAddress, [name]: value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Shipping Address:", shippingAddress);
		console.log("Billing Address:", billingAddress);
	};

	return (
		<div class="container">
			<form onSubmit={handleSubmit}>
				<h3>Shipping Address</h3>
				<div className="mb-3">
					<label htmlFor="shipping-name" className="form-label">
						Name:
					</label>
					<input
						type="text"
						id="shipping-name"
						name="name"
						value={shippingAddress.name}
						onChange={handleShippingAddressChange}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="shipping-addressLine1" className="form-label">
						Address Line 1:
					</label>
					<input
						type="text"
						id="shipping-addressLine1"
						name="addressLine1"
						value={shippingAddress.addressLine1}
						onChange={handleShippingAddressChange}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="shipping-addressLine2" className="form-label">
						Address Line 2:
					</label>
					<input
						type="text"
						id="shipping-addressLine2"
						name="addressLine2"
						value={shippingAddress.addressLine2}
						onChange={handleShippingAddressChange}
						className="form-control"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="shipping-city" className="form-label">
						City:
					</label>
					<input
						type="text"
						id="shipping-city"
						name="city"
						value={shippingAddress.city}
						onChange={handleShippingAddressChange}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="shipping-state" className="form-label">
						State:
					</label>
					<input
						type="text"
						id="shipping-state"
						name="state"
						value={shippingAddress.state}
						onChange={handleShippingAddressChange}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="shipping-zip" className="form-label">
						Zip Code:
					</label>
					<input
						type="text"
						id="shipping-zip"
						name="zip"
						value={shippingAddress.zip}
						onChange={handleShippingAddressChange}
						className="form-control"
						required
					/>
				</div>

				<h3>Billing Address</h3>
				<div class="form-group">
					<label for="billing-name">Name:</label>
					<input
						type="text"
						id="billing-name"
						name="name"
						value={billingAddress.name}
						onChange={handleBillingAddressChange}
						class="form-control"
						required
					/>
				</div>
				<div class="form-group">
					<label for="billing-addressLine1">Address Line 1:</label>
					<input
						type="text"
						id="billing-addressLine1"
						name="addressLine1"
						value={billingAddress.addressLine1}
						onChange={handleBillingAddressChange}
						class="form-control"
						required
					/>
				</div>
				<div class="form-group">
					<label for="billing-addressLine2">Address Line 2:</label>
					<input
						type="text"
						id="billing-addressLine2"
						name="addressLine2"
						value={billingAddress.addressLine2}
						onChange={handleBillingAddressChange}
						class="form-control"
					/>
				</div>
				<div class="form-group">
					<label for="billing-city">City:</label>
					<input
						type="text"
						id="billing-city"
						name="city"
						value={billingAddress.city}
						onChange={handleBillingAddressChange}
						class="form-control"
						required
					/>
				</div>
				<div class="form-group">
					<label for="billing-state">State:</label>
					<input
						type="text"
						id="billing-state"
						name="state"
						value={billingAddress.state}
						onChange={handleBillingAddressChange}
						class="form-control"
						required
					/>
				</div>
				<div class="form-group">
					<label for="billing-zip">Zip:</label>
					<input
						type="text"
						id="billing-zip"
						name="zip"
						value={billingAddress.zip}
						onChange={handleBillingAddressChange}
						class="form-control"
						required
					/>
				</div>
				<br></br>
				<button type="button" class="btn btn-primary">
					Submit Order
				</button>
			</form>
		</div>
	);
};

export default AddressForm;
