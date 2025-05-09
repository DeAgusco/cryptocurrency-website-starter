module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        lg: '0',
      },
    },
    fontFamily: {
      primary: 'Rubik',
    },
    extend: {
      colors: {
        darkblue: {
          DEFAULT: '#0D0D2B',
          secondary: '#252540',
          tertiary: '#131b2e',
        },
        blue: {
          DEFAULT: '#3671E9',
          hover: '#2766E6',
          neon: '#00d4ff',
          dark: '#0f172a',
        },
        gray: {
          DEFAULT: '#E0E0E0',
          dark: '#1e293b',
        },
        violet: '#2B076E',
        white: '#ffffff',
        purple: {
          light: '#a855f7',
          glow: '#a855f7',
        },
        cyan: {
          neon: '#0ff',
        },
      },
      boxShadow: {
        primary: '0px 20px 200px rgba(57, 23, 119, 0.05)',
        'glow-blue': '0 0 20px rgba(54, 113, 233, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'inner-white': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        newsletter: "url('/src/assets/img/newsletter-bg.png')",
        newsletterBox: "url('/src/assets/img/newsletter-box.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-pattern': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%233671e9\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      transform: {
        'scale-105': 'scale(1.05)',
      },
      keyframes: {
        'snake-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-3px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-rotate': {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, filter: 'blur(5px)' },
          '50%': { opacity: 1, filter: 'blur(10px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'snake-bounce': 'snake-bounce 1s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'float-rotate': 'float-rotate 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 5s ease infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
  },
  plugins: [],
};