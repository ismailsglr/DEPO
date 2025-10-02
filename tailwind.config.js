/** @type {import('tailwindcss').Config} */
export default {
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
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#10b981',
          pink: '#ec4899',
          cyan: '#06b6d4',
          yellow: '#f59e0b',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        cyber: {
          dark: '#0a0a0a',
          darker: '#050505',
          gray: '#1a1a1a',
          light: '#2a2a2a',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'cyber-glow': 'cyber-glow 3s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'hologram': 'hologram 4s ease-in-out infinite',
        'cyber-scan': 'cyber-scan 2s ease-in-out infinite',
        'particle-float': 'particle-float 8s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'data-stream': 'data-stream 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(1deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(147, 51, 234, 0.8)' },
        },
        'neon-pulse': {
          '0%': { 
            boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff',
            textShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff'
          },
          '100%': { 
            boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
            textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff'
          },
        },
        'cyber-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6), inset 0 0 40px rgba(0, 212, 255, 0.2)',
            borderColor: 'rgba(0, 212, 255, 0.6)'
          },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'hologram': {
          '0%, 100%': { 
            opacity: 0.8,
            transform: 'translateY(0px) scale(1)',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            opacity: 1,
            transform: 'translateY(-10px) scale(1.02)',
            filter: 'hue-rotate(180deg)'
          },
        },
        'cyber-scan': {
          '0%': { 
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
            transform: 'translateX(-100%)'
          },
          '100%': { 
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
            transform: 'translateX(100%)'
          },
        },
        'particle-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: 0.3
          },
          '25%': { 
            transform: 'translateY(-20px) translateX(10px) rotate(90deg)',
            opacity: 0.8
          },
          '50%': { 
            transform: 'translateY(-10px) translateX(-5px) rotate(180deg)',
            opacity: 0.5
          },
          '75%': { 
            transform: 'translateY(-30px) translateX(15px) rotate(270deg)',
            opacity: 0.9
          },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'data-stream': {
          '0%': { 
            backgroundPosition: '0% 50%',
            opacity: 0.3
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            opacity: 0.8
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            opacity: 0.3
          },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} 