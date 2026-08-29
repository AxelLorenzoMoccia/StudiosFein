import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CURSOR A MEDIDA
 * ----------------
 * Un punto que sigue al mouse con un leve retraso suavizado (en vez
 * de calcarlo 1:1 — se siente con peso, no robótico) y crece al pasar
 * sobre cualquier link/botón. La firma visual de sitios de agencia
 * premium (Apple, Linear) que se eligió como uno de los 3 puntos para
 * que el sitio se sienta "10 veces mejor".
 *
 * `mix-blend-mode: difference`, el mismo truco que ya usa
 * Header.jsx para su wordmark: así el punto se ve bien sobre
 * CUALQUIER fondo del sitio (oscuro o claro) sin lógica extra por
 * sección — se auto-invierte.
 *
 * Se apaga solo en dos casos:
 * - `pointer: coarse` (touch) — no hay cursor persistente que
 *   reemplazar ahí, y forzar uno podría interferir con el tap normal.
 * - `prefers-reduced-motion: reduce` — es un elemento que persigue al
 *   mouse en cada frame, exactamente el tipo de movimiento continuo
 *   que esa preferencia pide reducir (DESIGN.md §4.5).
 *
 * El cursor del sistema (`cursor: none`, ver la clase
 * `.fein-custom-cursor` en index.css) recién se oculta una vez que
 * este componente confirma que SÍ va a haber reemplazo — si `canUse`
 * da false, ni se toca: nunca hay un estado sin ningún cursor visible.
 *
 * No pasa por `useGSAP()` a propósito — mismo criterio que
 * PageLoader.jsx y useMagnetic.js: no hay scroll ni selectores de
 * texto de por medio, solo un ref concreto siguiendo al mouse.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const canUse =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canUse) return undefined;

    const dot = dotRef.current;
    document.body.classList.add('fein-custom-cursor');

    const setX = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'feinOut' });
    const setY = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'feinOut' });

    const handleMove = (event) => {
      setX(event.clientX);
      setY(event.clientY);
    };

    // Delegado en `document` (no un listener por elemento clickeable)
    // — cubre todo lo interactivo, incluido contenido que aparece
    // después (ej. las tarjetas del carrusel), sin tener que taggear
    // cada uno a mano salvo casos puntuales (`data-cursor-hover`, para
    // elementos clickeables que no son <a>/<button>, ver
    // PortfolioCarousel.jsx).
    const isInteractive = (target) => target.closest('a, button, [data-cursor-hover]');

    const handleOver = (event) => {
      if (isInteractive(event.target)) {
        gsap.to(dot, { scale: 2.4, duration: 0.25, ease: 'feinOut' });
      }
    };
    const handleOut = (event) => {
      if (isInteractive(event.target)) {
        gsap.to(dot, { scale: 1, duration: 0.25, ease: 'feinOut' });
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.body.classList.remove('fein-custom-cursor');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white will-change-transform"
      style={{ mixBlendMode: 'difference' }}
    />
  );
}
