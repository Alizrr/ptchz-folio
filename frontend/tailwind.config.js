/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06070a",
          900: "#0a0c11",
          850: "#0e1118",
          800: "#12151d",
          700: "#1a1e28",
        },
        emerald: { glow: "#34d399" },
        accent: { 1: "#34d399", 2: "#22d3ee", 3: "#818cf8" },
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"Sora"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-20px) scale(1.08)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1) both",
        drift: "drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
