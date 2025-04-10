/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'indextheme': "url('/assets/theme.gif')",
      },
      fontFamily: {
        wq: ['wq'],
      },
      animation: {
        'marquee': 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
      },
    },
  },
  plugins: [],
};
