/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Cuerpo/UI — todo lo que no sea un momento "editorial".
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Momentos editoriales puntuales: manifiesto (StatementSection) y
        // cierre de contacto (ContactSection). No se usa en el wordmark
        // "Fein" a propósito — el logo se mantiene siempre en sans.
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
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