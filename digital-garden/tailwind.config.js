/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#faf9f6',
          secondary: '#f2f0eb',
          card: '#ffffff',
          dark: '#1a1a1a',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#6b6b6b',
          muted: '#9a9a9a',
          inverse: '#faf9f6',
        },
        accent: {
          terracotta: '#c4a484',
          sage: '#a8b5a0',
          lavender: '#b8b3d3',
          clay: '#c78d7b',
        },
        border: {
          DEFAULT: 'rgba(26, 26, 26, 0.08)',
          strong: 'rgba(26, 26, 26, 0.2)',
        },
      },
      fontFamily: {
        'display-en': ['"Playfair Display"', 'Canela', '"Tiempos Headline"', 'Georgia', 'serif'],
        'display-zh': ['"Source Han Serif CN"', '"Noto Serif SC"', '"方正兰亭宋"', 'serif'],
        'body-en': ['Inter', '"Suisse Int\'l"', '"Helvetica Now"', 'sans-serif'],
        'body-zh': ['"Source Han Sans CN"', '"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
      },
      fontSize: {
        'hero-en': 'clamp(1rem, 2vw, 1.25rem)',
        'hero-zh': 'clamp(3.5rem, 10vw, 8rem)',
        h1: 'clamp(2.5rem, 5vw, 4rem)',
        h2: 'clamp(1.75rem, 3vw, 2.5rem)',
        h3: 'clamp(1.25rem, 2vw, 1.5rem)',
        body: 'clamp(1rem, 1.2vw, 1.125rem)',
        small: '0.875rem',
        caption: '0.75rem',
      },
      letterSpacing: {
        'display-en': '0.15em',
        'display-zh': '0.05em',
      },
      maxWidth: {
        container: '1400px',
      },
      padding: {
        container: 'clamp(1.5rem, 5vw, 4rem)',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
