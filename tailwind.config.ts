/** @type {import('tailwindcss').Config} */
// Tailwind CSS configuration file.
module.exports = {
  // Specifies files to scan for Tailwind CSS classes.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Defines the theme customizations.
  theme: {
    extend: {
      // Custom color palette.
      colors: {
        "forest-green": "#228B22",
        "pine-green": "#01796F",
        "leaf-green": "#90EE90",
        "pale-leaf": "#F0FFF0",
        "bark-brown": "#8B4513",
        "stone-gray": "#808080",
      },
      // Custom font families.
      fontFamily: {
        sans: ['"Nunito Sans"', "sans-serif"],
        serif: ['"Merriweather"', "serif"],
      },
      // Custom background images (currently unused but available).
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  // No custom plugins are currently used.
  plugins: [],
};
