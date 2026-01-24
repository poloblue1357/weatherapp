// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',            // Ensure it's pointing to your HTML file
        './src/**/*.{js,jsx,ts,tsx}', // Pointing to your React components (JSX)
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};



