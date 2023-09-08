import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: [
			{
				light: {
					primary: '#2563eb',
					secondary: '#0ea5e9',
					accent: '#4f46e5',
					neutral: '#2b3440',
					'base-100': '#ffffff',
					info: '#3abff8',
					success: '#36d399',
					warning: '#fbbd23',
					error: '#f87272',
				},
				dark: {
					primary: '#2563eb',
					secondary: '#0ea5e9',
					accent: '#4f46e5',
					neutral: '#2b3440',
					'base-100': '#1d232a',
					info: '#3abff8',
					success: '#36d399',
					warning: '#fbbd23',
					error: '#f87272',
				},
			},
		],
	},
	plugins: [require('daisyui')],
};
export default config;
