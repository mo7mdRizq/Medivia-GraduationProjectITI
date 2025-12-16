/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1A56DB',
                'primary-light': '#EBF5FF',
                secondary: '#0E9F6E',
                'secondary-light': '#DEF7EC',
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    800: '#1F2937',
                    900: '#111827',
                }
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
