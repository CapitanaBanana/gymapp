// tailwind.config.js
const path = require('path');
module.exports = {
	content: [
		path.join(__dirname, 'frontend/views/**/*.ejs'),
		path.join(__dirname, 'frontend/public/**/*.{html,js}'),
	],

	theme: {
		extend: {
			colors: {
				primary: '#1D4ED8 ',
				secondary: '#9333EA',
				danger: '#EF4444',
				warning: '#FAE4ABFF',
				success: '#10B981',
				neutral: '#F3F4F6',
				primarydark: '#1E3A8A',
			},
			fontFamily: {
				sans: ['"Open Sans"', 'sans-serif'],
				serif: ['"Roboto"', 'serif'],
				poppins: ['Poppins', 'sans-serif'],
			},
			spacing: {
				18: '4.5rem',
				36: '9rem',
			},
			borderRadius: {
				'4xl': '2rem',
			},
		},
	},
	plugins: [],
};
