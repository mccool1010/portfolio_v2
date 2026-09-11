/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Small phones (iPhone SE / Galaxy A-series) sit below Tailwind's `sm`
        xs: '400px',
      },
      colors: {
        // Core dark AI theme
        surface: {
          DEFAULT: '#0a0e1a',
          50: '#0d1220',
          100: '#111827',
          200: '#1a2035',
          300: '#1f2937',
          400: '#2a3348',
        },
        accent: {
          cyan: '#22d3ee',
          'cyan-dim': '#0891b2',
          purple: '#a855f7',
          'purple-dim': '#7c3aed',
          pink: '#ec4899',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'panel-slide': 'panel-slide 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-slower': 'float-slower 10s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'aurora': 'aurora 15s ease-in-out infinite alternate',
        'aurora-2': 'aurora-2 12s ease-in-out infinite alternate-reverse',
        'aurora-3': 'aurora-3 18s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'stagger-in': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        'panel-slide': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(-1deg)' },
          '66%': { transform: 'translateY(4px) rotate(1deg)' },
        },
        'float-slower': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'aurora': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(10px, -30px) scale(1.05)' },
        },
        'aurora-2': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-40px, 30px) scale(1.15)' },
          '100%': { transform: 'translate(20px, -20px) scale(0.95)' },
        },
        'aurora-3': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, 40px) scale(0.95)' },
          '66%': { transform: 'translate(-30px, -10px) scale(1.1)' },
          '100%': { transform: 'translate(15px, 25px) scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'panel': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
