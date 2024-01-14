import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function Wrapper({ reload, children }) {
	return (
		<div className="w-screen h-screen relative overflow-x-hidden overflow-hidden">
			<div className="h-screen absolute flex w-screen">
				<div className="w-[20vw] h-screen">
					<Sidebar reload={reload} />
				</div>
				<div className="relative h-screen grid w-[80vw] px-5">
					<div className="absolute w-full">
						<Navbar />
					</div>
					<div className="h-screen w-full px-5">{children}</div>
				</div>
			</div>
			<div className="">
				<Footer />
			</div>
		</div>
	);
}

export default Wrapper;
