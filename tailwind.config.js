/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          'primary-dark': '#1a1a1a',
          'secondary-dark': '#2c2c2c',
          'accent-blue': '#00bfff',
          // App custom brand color used across buttons and borders
          'customGreen': '#16a34a', // tailwind green-600
        }
      },
    },
    plugins: [],
  };
  
