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
        "forest-green": "#228B22", // Rich, dark green
        "pine-green": "#01796F", // Deep, cool green
        "emerald-green": "#50C878", // Bright, vibrant green
        "mint-green": "#98FF98", // Light, refreshing green
        "sage-green": "#B2AC88", // Muted, earthy green
        "olive-green": "#808000", // Dull, yellowish-green
        "fern-green": "#4F7942", // Natural, leafy green
        "moss-green": "#8FBC8F", // Soft, muted green

        "background-app": "#FAF0E6", // Linen - for general app background
        "text-on-light-primary": "#374151", // Dark gray for primary text on light backgrounds
        "text-on-light-secondary": "#6B7280", // Lighter gray for secondary text on light backgrounds

        "text-on-dark-primary": "#F0FFF0", // Honeydew - for primary text on dark backgrounds
        "text-on-dark-secondary": "#D3D3D3", // LightGray - for secondary text on dark backgrounds

        // "accent": "#FFD700", // Gold (for highlights and calls to action)
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
