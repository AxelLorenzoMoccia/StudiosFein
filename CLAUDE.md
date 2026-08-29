# Fein — Landing page

Vite + React (JS) + Tailwind + GSAP/ScrollTrigger. Sin backend. Landing
informativa estilo Apple para una agencia de diseño, narrada por scroll.

## Diseño

@DESIGN.md

Ese archivo gobierna toda decisión visual, tipográfica, de layout y de
animación en este repo — leerlo antes de tocar cualquier componente de
`src/components/`.

## MCP: 21st.dev (generación de componentes UI)

`.mcp.json` conecta el servidor MCP de 21st.dev (`/ui <descripción>` para
traer componentes React/Tailwind ya pulidos de su librería, en vez de
armarlos desde cero). El archivo viaja por git, pero **no** contiene la API
key — solo la referencia como `${TWENTY_FIRST_API_KEY}`.

Para que funcione en una máquina nueva (o si `${TWENTY_FIRST_API_KEY}` no
resuelve):

1. Conseguir/copiar la key en [21st.dev/mcp](https://21st.dev/mcp) (si ya
   existe una, la misma sirve en todas las máquinas — no es por dispositivo).
2. Guardarla como variable de entorno de usuario:
   ```powershell
   setx TWENTY_FIRST_API_KEY "tu-key-acá"
   ```
3. **Cerrar la terminal/sesión de Claude Code y abrir una nueva** — `setx`
   escribe la variable de forma persistente, pero solo la ven los procesos
   que arrancan *después*; la sesión ya abierta no la va a ver.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint     # eslint
```

## Estructura

- `src/App.jsx` — orden de las secciones de la landing.
- `src/components/` — una sección o pieza reusable por archivo.
- `src/hooks/useGSAP.js` — hook base para toda animación (gsap.context +
  cleanup automático + easings custom `feinOut`/`feinInOut`).
- `src/assets/frames/macbook/`, `src/assets/videos/`, `src/assets/gallery/`,
  `src/assets/logos/` — assets que los componentes auto-importan vía
  `import.meta.glob` (no hace falta editar código al agregar/sacar archivos,
  ver el comentario de cabecera de cada componente que los usa).
