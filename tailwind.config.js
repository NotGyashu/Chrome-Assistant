module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          light: {
            primary: '#2563EB',
            secondary: '#BFDBFE',
            background: '#F8FAFC',
            text: '#1E293B',
            accent: '#1D4ED8',
            error: '#DC2626'
          },
          dark: {
            primary: '#1D4ED8',
            secondary: '#1E3A8A',
            background: '#0F172A',
            text: '#F8FAFC',
            accent: '#60A5FA',
            error: '#EF4444'
          }
        }
      }
    }
  },
  plugins: [],
}