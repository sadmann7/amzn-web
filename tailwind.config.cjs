/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          white: "hsl(0, 0%, 100%)",
          neutral: "hsl(0, 0%, 90%)",
        },
        primary: "hsl(27, 96%, 61%)",
        secondary: "hsl(220, 9%, 46%)",
        success: "hsl(142, 71%, 45%)",
        danger: "hsl(0, 84%, 60%)",
        layout: "hsl(221, 39%, 11%)",
        "layout-light": "hsl(217, 19%, 27%)",
        lowkey: "hsl(0, 0%, 45%)",
        title: "hsl(0, 0%, 15%)",
        text: "hsl(0, 0%, 25%)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@headlessui/tailwindcss"),
  ],
};
