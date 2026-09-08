/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        clinica: {
          emerald: {
            DEFAULT: '#059669',
            light: '#10b981',
            dark: '#047857'
          },
          // Paleta cromática clínica de CEDO-REHAB
          fucsia: {
            bg: '#f3e8ff',
            border: '#c084fc',
            text: '#581c87'
          },
          melon: {
            bg: '#fde2e4',
            border: '#f8ad9d',
            text: '#6e4450'
          },
          verde: {
            bg: '#d8f3dc',
            border: '#74c69d',
            text: '#1b4332'
          },
          amarillo: {
            bg: '#fef9c3',
            border: '#fde047',
            text: '#713f12'
          },
          azul: {
            bg: '#e0f2fe',
            border: '#7dd3fc',
            text: '#0369a1'
          },
          anaranjado: {
            bg: '#ffedd5',
            border: '#fb923c',
            text: '#9a3412'
          },
          feriado: {
            bg: '#f87171',
            text: '#ffffff'
          }
        }
      }
    }
  },
  plugins: []
};
