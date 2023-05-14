import React, { useEffect } from "react";

function OrderSuccess() {
	useEffect(() => {}, []);
	return (
		<div>
			<h2>Your order was successful!</h2>
			<p>
				We are connecting you with the nearest driver. They will contact you
				shortly to confirm your delivery details.
			</p>
		</div>
	);
}

export default OrderSuccess;
