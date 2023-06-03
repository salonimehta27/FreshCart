import React from "react";

function Footer() {
	return (
		<footer
			className="text-black text-center py-4"
			style={{ backgroundColor: "#EAF5EB" }}
		>
			<div className="container">
				<p className="mb-0">
					&copy; {new Date().getFullYear()} Your Company Name. All rights
					reserved.
				</p>
				<p className="mb-0">Address: 123 Main Street, City, State ZIP</p>
				<p className="mb-0">Phone: (123) 456-7890</p>
				<p className="mb-0">Email: info@yourcompany.com</p>
			</div>
		</footer>
	);
}

export default Footer;
