/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    500: '#2563EB', // Adjust based on exact color picker if needed
                    600: '#1D4ED8',
                }
            }
        },
    },
    plugins: [],
}
