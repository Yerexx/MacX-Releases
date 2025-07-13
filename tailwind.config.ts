import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
	theme: {
		extend: {
			colors: {
				// Modern MacX Color Palette
				macx: {
					// Primary brand colors
					primary: "#6366f1", // Indigo
					secondary: "#8b5cf6", // Violet
					accent: "#06b6d4", // Cyan
					
					// Text colors
					text: "#f8fafc", // Slate 50
					subtext: "#cbd5e1", // Slate 300
					muted: "#94a3b8", // Slate 400
					
					// Background colors
					bg: "#0f172a", // Slate 900
					surface: "#1e293b", // Slate 800
					card: "#334155", // Slate 700
					border: "#475569", // Slate 600
					
					// Status colors
					success: "#10b981", // Emerald 500
					warning: "#f59e0b", // Amber 500
					error: "#ef4444", // Red 500
					info: "#3b82f6", // Blue 500
				},
				// Legacy support (gradually remove)
				ctp: {
					text: "#f8fafc",
					subtext1: "#cbd5e1",
					subtext0: "#94a3b8",
					base: "#0f172a",
					mantle: "#1e293b",
					surface1: "#334155",
					surface0: "#475569",
				},
				accent: {
					light: "#8b5cf6",
					DEFAULT: "#6366f1",
					gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
				},
			},
			backgroundImage: {
				"macx-gradient": "linear-gradient(135deg, #6366f1, #8b5cf6)",
				"macx-gradient-r": "linear-gradient(to right, #6366f1, #8b5cf6)",
				"macx-hero": "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
				"macx-card": "linear-gradient(145deg, #1e293b, #334155)",
				"accent-gradient": "linear-gradient(135deg, #6366f1, #8b5cf6)",
				"accent-gradient-r": "linear-gradient(to right, #6366f1, #8b5cf6)",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.5s ease-out",
				"slide-in": "slideIn 0.3s ease-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideIn: {
					"0%": { transform: "translateX(-20px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
			},
			boxShadow: {
				glow: "0 0 20px -5px rgba(99, 102, 241, 0.3)",
				"macx-card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(99, 102, 241, 0.1)",
				"macx-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(99, 102, 241, 0.2)",
				"macx-glow": "0 0 30px -5px rgba(99, 102, 241, 0.4)",
			},
		},
	},
	plugins: [],
} satisfies Config;
