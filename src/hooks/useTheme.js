import { useEffect, useState } from 'react';

/**
 * Lee si el tema oscuro está activo (clase `dark` en <html>,
 * controlada por ThemeToggle.jsx) de forma REACTIVA — para el resto
 * del sitio alcanza con CSS puro (`dark:` de Tailwind, o la cascada
 * `.dark .bg-fein-light` de index.css para las dos clases que no son
 * utilities reales), pero algunos estilos son demasiado dinámicos
 * para expresarse en CSS (ej. un gradiente inline armado en JS según
 * la foto actual) y necesitan saber el tema desde el componente.
 *
 * `MutationObserver` en vez de un Context/Provider: es un solo booleano,
 * de solo lectura, que cambia rara vez (un click en el toggle) — no
 * amerita la infraestructura de un Context para algo así de chico.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default useTheme;
