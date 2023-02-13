const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./src/**/*.js'],
    safelist: [
        'bg-gray-400',
        'bg-blue-400',
        'bg-yellow-400',
        'bg-green-400',
        'bg-red-400',
        'border-gray-400',
        'border-blue-400',
        'border-yellow-400',
        'border-green-400',
        'border-red-400',
    ],
    darkMode: 'media',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            spacing: {
                '100%': '100%',
            },
        },
    },
    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
