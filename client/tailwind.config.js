/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Slate/charcoal + copper flashing accent — grounded in the actual
        // materials of a roof rather than a generic brand palette.
        slate: {
          950: '#161b22',
          900: '#1f2630',
          800: '#2b3543',
          700: '#3c4b5e',
          600: '#54687f',
        },
        copper: {
          600: '#a8552e',
          500: '#c1622d',
          400: '#d97f43',
          100: '#fbe9dd',
        },
        canvas: '#f6f4f0',
        slateblue: '#5b7688',
      },
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      // A modest bump over Tailwind's defaults — just enough that body
      // copy and labels are comfortable on a phone, without ballooning
      // the layout.
      fontSize: {
        xs: ['0.78rem', { lineHeight: '1.15rem' }],
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.1rem', { lineHeight: '1.6rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.45rem', { lineHeight: '1.9rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.1rem' }],
        '4xl': ['2.1rem', { lineHeight: '2.4rem' }],
        '5xl': ['2.6rem', { lineHeight: '2.8rem' }],
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        riseIn: 'riseIn 0.45s ease-out both',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
