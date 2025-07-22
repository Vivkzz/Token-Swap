/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    plugins: [],
}
