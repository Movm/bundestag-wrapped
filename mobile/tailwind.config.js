/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Match web app dark theme
        background: "#0a0a0f",
        foreground: "#fafafa",
        muted: "#18181b",
        "muted-foreground": "#a1a1aa",
        primary: "#fafafa",
        "primary-foreground": "#18181b",
        secondary: "#27272a",
        "secondary-foreground": "#fafafa",
        accent: "#27272a",
        "accent-foreground": "#fafafa",
        border: "#27272a",
        ring: "#3f3f46",
      },
    },
  },
  plugins: [],
};
