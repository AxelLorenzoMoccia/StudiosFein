import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/**
 * Curvas custom (no las genéricas `power2`/`ease` de siempre) — las
 * mismas que usan Vercel/Linear, vía la skill "emil-design-eng"
 * (animations.dev). Los `power*` de GSAP están bien, pero estas se
 * sienten más "con intención": entran/salen más fuerte, no como un
 * ease genérico de manual.
 *
 * `CustomEase.create(nombre, "x1,y1,x2,y2")` acepta directamente los
 * 4 números de un cubic-bezier estándar (sin necesidad de convertir a
 * su formato de path). Gratis desde GSAP 3.12 — antes era plugin pago
 * del Club GreenSock.
 */
CustomEase.create('feinOut', '0.23, 1, 0.32, 1');
CustomEase.create('feinInOut', '0.77, 0, 0.175, 1');

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
