/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Una sola tipografía para todo el sitio.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Acento de marca — dorado apagado, usado con cuentagotas (un
        // link en hover, un número, un anillo). Nunca como color de
        // fondo grande: la marca es neutra, esto es la excepción que
        // confirma la regla.
        accent: {
          DEFAULT: '#b08b4f',
          light: '#d4b876',
        },
      },
    },
  },
  plugins: [],
}