// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',            // Ensure it's pointing to the HTML file
        './src/**/*.{js,jsx,ts,tsx}', // Pointing to the React components (JSX)
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};



