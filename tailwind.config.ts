cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:      "#1a1f5e",
          navyLight: "#2d3494",
          white:     "#ffffff",
          offwhite:  "#f4f6fb",
          accent:    "#e8c547",
          gray:      "#6b7280",
          lightgray: "#e5e7eb",
        },
      },
      fontFamily: {
        sans:    ["DM Sans", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        xl3: "2rem",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(26,31,94,0.10)",
        nav:  "0 2px 16px 0 rgba(26,31,94,0.08)",
      },
    },
  },
  plugins: [],
};
EOF