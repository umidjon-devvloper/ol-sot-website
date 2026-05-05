/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF1EB',
          100: '#FFE5DA',
          200: '#FFCAB5',
          300: '#FFA88A',
          400: '#FF8A5F',
          500: '#FF6B35',
          600: '#E85A28',
          700: '#C2461C',
          800: '#9C3717',
          900: '#7A2C12',
        },
        ink: {
          DEFAULT: '#0A0A0F',
          secondary: '#52525B',
          muted: '#A1A1AA',
        },
        'ink-dark': {
          DEFAULT: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F4F5',
        },
        'surface-dark': {
          DEFAULT: '#13131A',
          muted: '#1F1F28',
          elevated: '#1C1C24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF6B35 0%, #E85A28 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      },
    },
  },
  plugins: [],
};
