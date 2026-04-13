import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#0A0F1E",
        cyan: "#38F2CF",
        ember: "#FF6B57",
        gold: "#F4C95D",
        fog: "#E8F6F8",
        steel: "#50627A"
      },
      fontFamily: {
        display: ["var(--font-oxanium)"],
        body: ["var(--font-space)"],
        mono: ["var(--font-plex)"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 242, 207, 0.2), 0 20px 80px rgba(56, 242, 207, 0.16)"
      },
      backgroundImage: {
        "vein-grid": "radial-gradient(circle at top, rgba(56,242,207,0.18), transparent 26%), linear-gradient(120deg, rgba(255,107,87,0.18), transparent 34%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      backgroundSize: {
        "vein-grid": "100% 100%, 100% 100%, 44px 44px, 44px 44px"
      },
      animation: {
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "rise-in": "rise-in 0.8s ease-out both"
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: [animate]
};

export default config;
