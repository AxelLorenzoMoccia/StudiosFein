import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook "magnético": el elemento se desplaza levemente hacia el mouse
 * cuando está cerca, y vuelve a su lugar al alejarse — el toque
 * clásico de los CTA principales en sitios de agencia premium (Apple,
 * Linear, estudios de diseño top de Awwwards).
 *
 * Uso:
 *   const magneticRef = useMagnetic();
 *   <a ref={magneticRef} href="#contacto">Contactar</a>
 *
 * Solo se activa con mouse de verdad (`pointer: fine` — nunca en
 * touch, no tiene sentido ahí) y si el usuario no pidió menos
 * movimiento (`prefers-reduced-motion`): es puro movimiento
 * decorativo atado al cursor, exactamente lo que esa preferencia pide
 * reducir (DESIGN.md §4.5). A propósito se usa en muy pocos elementos
 * — los CTA principales, no todo lo clickeable del sitio (regla de
 * "máximo 1-2 elementos protagonistas animando por vista").
 *
 * No pasa por `useGSAP()` (el hook scopeado a ScrollTrigger de este
 * proyecto) a propósito: esto no tiene scroll de por medio y el
 * target siempre es el mismo ref concreto, no un selector de texto —
 * mismo criterio que PageLoader.jsx.
 */
export function useMagnetic(strength = 0.35, maxOffset = 14) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const canUse =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canUse) return undefined;

    const setX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'feinOut' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'feinOut' });

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      setX(gsap.utils.clamp(-maxOffset, maxOffset, relX * strength));
      setY(gsap.utils.clamp(-maxOffset, maxOffset, relY * strength));
    };

    const handleLeave = () => {
      setX(0);
      setY(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength, maxOffset]);

  return ref;
}

export default useMagnetic;
