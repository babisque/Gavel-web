/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gavel-dark': '#1a1a1a',
                'gavel-green': '#4ade80'
            }
        },
    },
    plugins: [],
}