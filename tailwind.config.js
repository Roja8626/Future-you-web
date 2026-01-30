/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Lora', 'serif'],
            },
            colors: {
                lavender: {
                    50: '#fdfbfd',
                    100: '#f7f4f8',
                    200: '#ece5ef',
                    300: '#dcd0e3',
                    400: '#c5b1d3',
                    500: '#ad92c1',
                },
                misty: {
                    50: '#f2fbfb',
                    100: '#e0f6f6',
                    200: '#c3eced',
                    300: '#96dee0',
                    400: '#62c6ca',
                },
                peach: {
                    50: '#fff9f5',
                    100: '#fff0e6',
                    200: '#ffe0cc',
                    300: '#ffc8a8',
                    400: '#ffa67c',
                },
                warm: {
                    50: '#fafaf9',   /* stone-50 */
                    100: '#f5f5f4',  /* stone-100 */
                    200: '#e7e5e4',  /* stone-200 */
                    800: '#292524',  /* stone-800 */
                    900: '#1c1917',  /* stone-900 */
                },
                amber: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 1.2s ease-out forwards',
                'float': 'float 12s ease-in-out infinite',
                'float-delayed': 'float 12s ease-in-out 6s infinite',
                'pulse-slow': 'pulseSoft 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scale-pulse': 'scalePulse 4s ease-in-out infinite',
                'ripple': 'ripple 0.6s linear forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                scalePulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                ripple: {
                    '0%': { transform: 'scale(0)', opacity: '0.5' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                }
            }
        }
    },
    plugins: [],
}
