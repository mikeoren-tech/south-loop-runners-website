import type { Config } from 'tailwindcss'

const config: Config = {
  // CRITICAL: Tells Tailwind where to find and generate CSS classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 💡 Custom SLR Colors (to match your CSS variables)
        'slr-blue': 'var(--slr-blue)',
        'slr-red': 'var(--slr-red)',
        'slr-blue-dark': 'var(--slr-blue-dark)',
        'slr-blue-light': 'var(--slr-blue-light)',
        // Social Brand Colors
        'social-facebook': '#1877F2',
        'social-strava': '#FC4C02',
        // Standard Shadcn/Radix aliases (already defined in your CSS)
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'bgcal': 'var(--bgcal)',
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'destructive': 'var(--destructive)',
        // ... include other standard aliases if needed (e.g., card, border, ring)
      },
      borderRadius: {
        // Ensures rounded-2xl and larger classes are available for the glass cards
        'xl': '1rem',
        '2xl': '1.5rem', 
        '3xl': '2rem',
      },
      boxShadow: {
        // Ensure this is here if you have custom shadow classes
        'lg': 'var(--tw-shadow-lg)',
        'xl': 'var(--tw-shadow-xl)',
        '2xl': 'var(--tw-shadow-2xl)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite'
      }
    },
  },
  // Ensure 'dark' mode works with your custom CSS variable setup
  darkMode: ['class'],
}

export default config;
