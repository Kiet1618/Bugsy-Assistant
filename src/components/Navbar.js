import React from "react";

const Navbar = () => {
	return (
		<div className="py-5 h-full w-[95%] mx-auto flex justify-between place-items-center">
			<div className="flex justify-center place-items-center my-auto">
				<img
					src="https://i.ibb.co/kqL4gCS/icon.png"
					alt="logo"
					className="h-14"
				/>
				<p className="text-xl text-left text-primary-300">
					<span className="font-extrabold text-primary-700">Bugsy</span>{" "}
					Assistant
				</p>
			</div>
		</div>
	);
};

export default Navbar;
