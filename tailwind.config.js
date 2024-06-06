/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"light-green": "#129C5233",
				"dark-green": "#129C52aa",
			},
			borderRadius: {
				half: "50px",
				"3quarter": "75px",
			},
		},
	},
	plugins: [],
};
