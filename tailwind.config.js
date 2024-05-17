/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx}"];
export const theme = {
	extend: {
		colors: {
			primary: "#050816",
			secondary: "#aaa6c3",
			tertiary: "#151030",
			"transperent-80": "#eae6ff",
			"purple-shade": "c06fcb",
			"black-100": "#100d25",
			"black-200": "#090325",
			"white-100": "#f3f3f3",
		},
		boxShadow: {
			card: "0px 35px 120px -15px #211e35",
		},
		backgroundImage: {
			"gradient-diagonal": "linear-gradient(-45deg,  #bf68c6, #6352ec)",
		},
	},
};
export const plugins = [];
