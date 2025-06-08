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
        "verda-green": "#2ab985", // New primary green
        "forest-green": "#228B22", // Rich, dark green
        "pine-green": "#01796F", // Deep, cool green
        "emerald-green": "#50C878", // Bright, vibrant green
        "mint-green": "#98FF98", // Light, refreshing green
        "sage-green": "#B2AC88", // Muted, earthy green
        "olive-green": "#808000", // Dull, yellowish-green
        "fern-green": "#4F7942", // Natural, leafy green
        "moss-green": "#8FBC8F", // Soft, muted green

        "background-app": "#F0FDF4", // Light green tint for background
        "text-on-light-primary": "#1F2937", // Darker gray for better contrast
        "text-on-light-secondary": "#4B5563", // Medium gray

        "text-on-dark-primary": "#FFFFFF", // White for primary text on dark backgrounds
        "text-on-dark-secondary": "#E5E7EB", // Lighter gray for secondary text on dark backgrounds

        "nav-hover-bg": "#1c8c6c", // Darker shade of verda-green for nav hover
        "nav-active-text": "#FFFFFF", // White for active nav text
        "nav-active-border": "#FFFFFF", // White for active nav border
      },
      // Custom font families.
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"], // Updated to Montserrat
        serif: ["var(--font-lora)", "serif"], // Updated to Lora
      },
      // Custom background images (currently unused but available).
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "leaf-pattern": "url('/verda-leaf-logo-pattern.svg')", // Updated to new Verda leaf pattern
      },
    },
  },
  // No custom plugins are currently used.
  plugins: [],
};
