/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					300: "#9DBC98",
					700: "#638889",
				},
				secondary: {
					300: "#F9EFDB",
					700: "#EBD9B4",
				},
			},
		},
	},
	plugins: [],
};
