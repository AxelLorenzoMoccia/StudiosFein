/** @type {import('tailwindcss').Config} */
export default {
  // 'selector': el modo oscuro se activa agregando la clase `dark` al
  // <html> a mano (ThemeToggle.jsx), no seguir ciegamente el
  // prefers-color-scheme del sistema — el sitio ahora es claro por
  // default (pedido explícito), con oscuro como opción, no al revés.
  darkMode: 'selector',
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