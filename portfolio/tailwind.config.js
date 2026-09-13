/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f8f9fb',
        ink: '#111827',
        sub: '#4b5563',
        muted: '#9ca3af',
        line: '#e5e7eb',
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          soft: '#eff4ff',
        },
        success: '#16a34a',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        site: '1200px',
      },
      borderRadius: {
        card: '10px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.05)',
        'card-hover':
          '0 4px 8px rgba(17, 24, 39, 0.05), 0 12px 32px rgba(17, 24, 39, 0.1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
};
