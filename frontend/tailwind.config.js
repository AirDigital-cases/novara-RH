/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1720",
        sand: "#f4efe8",
        clay: "#c97544",
        moss: "#1f4d45",
        mist: "#c9d6d1",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 32, 0.12)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 30%), radial-gradient(circle at 80% 0%, rgba(201,214,209,0.35), transparent 24%), linear-gradient(135deg, rgba(244,239,232,0.95), rgba(255,255,255,0.98))",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
