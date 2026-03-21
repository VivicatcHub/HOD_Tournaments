/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        hod: {
          purple: "#7c3aed",
          "purple-dark": "#6d28d9",
          "purple-light": "#a78bfa",
          accent: "#ec4899",
        },
      },
      backgroundImage: {
        "hod-gradient": "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
        "hod-light": "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)",
      },
      boxShadow: {
        "hod-sm": "0 2px 8px rgba(124, 58, 237, 0.15)",
        "hod-md": "0 4px 16px rgba(124, 58, 237, 0.25)",
      },
    },
  },
  plugins: [],
};
