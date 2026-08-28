# Fein — Landing page

Vite + React (JS) + Tailwind + GSAP/ScrollTrigger. Sin backend. Landing
informativa estilo Apple para una agencia de diseño, narrada por scroll.

## Diseño

@DESIGN.md

Ese archivo gobierna toda decisión visual, tipográfica, de layout y de
animación en este repo — leerlo antes de tocar cualquier componente de
`src/components/`.

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
