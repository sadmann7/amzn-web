/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          white: "hsl(0, 0%, 100%)",
          gray: "hsl(220, 14%, 96%)",
        },
        primary: "hsl(27, 96%, 61%)",
        secondary: "hsl(220, 9%, 46%)",
        success: "hsl(142, 71%, 45%)",
        danger: "hsl(0, 84%, 60%)",
        layout: "hsl(221, 39%, 11%)",
        "layout-light": "hsl(217, 19%, 27%)",
        lowkey: "hsl(220, 9%, 46%)",
        title: "hsl(0, 0%, 15%)",
        text: "hsl(0, 0%, 25%)",
        link: "hsl(193, 82%, 31%)",
      },
      screens: {
        xxs: "320px",
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
