/** @type {import('tailwindcss').Config} */
export default {
  content: ["./popup.html", "./sidepanel.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Blue
        primary: {
          light: "#60A5FA", // blue-400 for dark mode
          DEFAULT: "#2563EB", // blue-600 for light mode
        },
        // Backgrounds
        bg: {
          light: "#F8FAFC", // slate-50
          dark: "#020617", // slate-950
        },
        // Surface/Cards
        surface: {
          light: "#FFFFFF",
          dark: "#0F172A", // slate-900
        },
        // Text
        text: {
          primary: {
            light: "#0F172A", // slate-900
            dark: "#F8FAFC", // slate-50
          },
          secondary: {
            light: "#475569", // slate-600
            dark: "#CBD5E1", // slate-300
          },
        },
        // Borders
        border: {
          light: "#E2E8F0", // slate-200
          dark: "#1E293B", // slate-800
        },
        // Icons
        icon: {
          default: {
            light: "#64748B", // slate-500
            dark: "#94A3B8", // slate-400
          },
          active: {
            light: "#0F172A",
            dark: "#F8FAFC",
          },
        },
        // Quick Action Colors
        actions: {
          scan: "#6C5CE7", // Purple for Scan
          pdf: "#A29BFE", // Light purple for PDF
          youtube: "#FF7675", // Red for YouTube
          chat: "#4895EF", // Blue for Chat
          gita: "#FF9933", // Orange for Gita
          podcast: "#9B59B6", // Purple for Podcast
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        chip: "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.12)",
        elevated: "0 4px 12px rgba(0,0,0,0.15)",
      },
      animation: {
        "bounce-dot": "bounce 1.4s infinite ease-in-out",
        typewriter: "typing 0.05s steps(1) forwards",
      },
      keyframes: {
        bounce: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
        },
        typing: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
