/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "./css/**/*.{scss, css}"],
  theme: {
    extend: {
      colors: {
        "theme-btn": {
          bg: "rgb(var(--color-theme-btn-bg) / <alpha-value>)",
          text: "rgb(var(--color-theme-btn-text) / <alpha-value>)",
          border: "rgb(var(--color-theme-btn-border) / <alpha-value>)",
          active: {
            bg: "rgb(var(--color-theme-btn-active-bg) / <alpha-value>)",
            text: "rgb(var(--color-theme-btn-active-text) / <alpha-value>)",
            border: "rgb(var(--color-theme-btn-active-border) / <alpha-value>)",
          }
        },
        bkg: "rgb(var(--color-bkg) / <alpha-value>)",
        content: "rgb(var(--color-content) / <alpha-value>)"
      }
    },
  },
  plugins: [],
}
