/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slateblue: "#1d4ed8",
        tide: "#0f766e",
        sand: "#f8f4ec",
        ember: "#f97316",
        mist: "#e2e8f0",
        panel: "#0b1120",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)",
        panel: "0 32px 80px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(20, 184, 166, 0.22), transparent 24%), radial-gradient(circle at 85% 15%, rgba(249, 115, 22, 0.18), transparent 22%), linear-gradient(180deg, #fffdf7 0%, #f8f4ec 100%)",
        "dashboard-radial":
          "radial-gradient(circle at top left, rgba(20, 184, 166, 0.14), transparent 20%), radial-gradient(circle at 82% 12%, rgba(59, 130, 246, 0.18), transparent 18%), linear-gradient(180deg, #071120 0%, #0f172a 100%)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};
