import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.23, 1, 0.320, 1)',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.23, 1, 0.320, 1)',
        'float': 'float 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'smooth-scale': 'smoothScale 1s cubic-bezier(0.23, 1, 0.320, 1)',
        'fluid-expand': 'fluidExpand 1s cubic-bezier(0.23, 1, 0.320, 1)',
        scan: 'scan 4s linear infinite',
        scanSlow: 'scanSlow 12s linear infinite',
        scanFast: 'scanFast 2s linear infinite',
        flicker: 'flicker 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'fade-in-out': 'fade-in-out 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scanSlow: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scanFast: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' }
        },
        smoothScale: {
          '0%': { transform: 'scale(0.75)', opacity: '0' },
          '50%': { transform: 'scale(1.02)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        fluidExpand: {
          '0%': {
            width: '20%',
            height: '20%',
            borderRadius: '16px',
            transform: 'scale(0.8)',
            opacity: '0.3'
          },
          '50%': {
            transform: 'scale(1.01)',
            opacity: '0.9'
          },
          '100%': {
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'fade-in-out': {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config