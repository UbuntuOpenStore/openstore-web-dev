const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
  	extend: {
  		colors: {
  			primary: '#292929',
  			'ubuntu-orange': '#e95420',
  			'ubuntu-purple': '#8b3583'
  		},
  		fontFamily: {
  			sans: ["'Ubuntu'", ...defaultTheme.fontFamily.sans],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
