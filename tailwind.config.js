/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Helvetica Neue propia del cliente (ver @font-face en
        // index.css) — Inter/Google Fonts quedaron afuera del todo.
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta exacta que pidió el dueño de la marca (31 ago 2026,
        // 6 tonos) — "esta es la paleta que tenés que conservar en
        // toda la página". Nombrada semánticamente en vez de usar la
        // escala neutral-* genérica de Tailwind, para que sea obvio
        // en cada className CUÁL de los 6 tonos exactos se está
        // usando (y no colarse un neutral-500 de Tailwind que no es
        // ninguno de los 6 pedidos).
        paper: '#FDFDFD', // fondo base de toda la página
        linen: '#F0EEE7', // fondo secundario, tarjetas/paneles suaves
        sand: '#E7E4DB', // superficies/divisores un escalón más marcado
        stone: '#BEBEBC', // divisores y bordes finos
        ash: '#8B8B8B', // texto secundario (eyebrows, captions)
        ink: '#2A2A2A', // texto principal, logo, botones sólidos
      },
    },
  },
  plugins: [],
}
