import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook para animar con GSAP dentro de React de forma segura.
 *
 * Envuelve la animación en un gsap.context() ligado a un ref (`scope`),
 * de modo que los selectores (".clase") solo busquen dentro de ese
 * componente y que, al desmontar, se reviertan automáticamente todas
 * las animaciones y ScrollTriggers creados (sin memory leaks ni
 * triggers "fantasma" al navegar).
 *
 * Uso:
 *   const scope = useGSAP((gsap, ScrollTrigger) => {
 *     gsap.from('.titulo', {
 *       opacity: 0,
 *       y: 60,
 *       scrollTrigger: { trigger: '.titulo', start: 'top 80%' },
 *     });
 *   });
 *
 *   return <div ref={scope}>...</div>
 *
 * Si `animationCallback` necesita limpiar algo que gsap no maneja
 * (ej. un listener de "resize"), puede devolver una función de cleanup:
 *
 *   const scope = useGSAP(() => {
 *     const onResize = () => {...};
 *     window.addEventListener('resize', onResize);
 *     return () => window.removeEventListener('resize', onResize);
 *   });
 */
export function useGSAP(animationCallback, dependencies = []) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    let cleanup;
    const ctx = gsap.context(() => {
      cleanup = animationCallback(gsap, ScrollTrigger);
    }, scope);

    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return scope;
}

export default useGSAP;
