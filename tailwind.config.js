/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        geo: {
          dark: '#0f172a',      // Slate 900
          navy: '#1e293b',      // Slate 800
          card: '#ffffff',
          border: '#e2e8f0',    // Slate 200
          subtle: '#f8fafc',    // Slate 50
          muted: '#64748b',     // Slate 500
          primary: '#0369a1',   // Sky 700 (Engineering Blue)
          primaryHover: '#0284c7',
          known: '#1e3a8a',     // Dark Blue (Known drainage)
          recon: '#0284c7',     // Sky / Teal Blue (Reconstructed drainage)
          amber: '#d97706',     // Amber 600 (Low confidence / caution)
          danger: '#dc2626',    // Red 600 (Problem / bottleneck / surcharge)
          success: '#16a34a',   // Green 600 (Validated / resolved)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
