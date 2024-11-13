import daisyui from "daisyui";
import tailwindcssScrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sblack: "#011627",
        swhite: "#FDFFFC",
        syellow: "#FAC40F",
        sgreen: "#62C370",
        sred: "#D35269",
      },
    },
  },
  plugins: [daisyui, tailwindcssScrollbar],
};
