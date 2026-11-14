/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        dialog: ['"Silkscreen"', 'monospace'],
      },
      colors: {
        mars: {
          red: '#d94e28',
          rust: '#9e2e16',
          sand: '#e89b65',
          dark: '#140c1c',
          panel: '#1d162b',
        },
        capi: {
          cyan: '#22d3ee',
          teal: '#0891b2',
        },
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        engineShake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-2px, 1px)' },
          '50%': { transform: 'translate(2px, -1px)' },
          '75%': { transform: 'translate(-1px, -2px)' },
        },
        scanlineMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 2.6s ease-in-out infinite',
        engineShake: 'engineShake 0.14s linear infinite',
        scanlineMove: 'scanlineMove 8s linear infinite',
      },
    },
  },
  plugins: [],
};
