/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      fontFamily: {
        "firaSans" : ["Fira Sans Condensed", "sans-serif"]
      },
      colors: {
        "pallet1" : "#6482AD",
        "pallet2" : "#7FA1C3",
        "pallet3" : "#E2DAD6",
        "pallet4" : "#F5EDED",
      }
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}

