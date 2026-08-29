import { useGSAP } from '../hooks/useGSAP';

/**
 * SCROLL PROGRESS — barra fina de "cuánto falta"
 * -------------------------------------------------
 * Detalle chico, del tipo que nadie señala a propósito pero que suma
 * a la sensación general de pulido (DESIGN.md §1.1) — una línea de 3px
 * pegada al borde superior que crece de 0 a 100% del ancho a medida
 * que se scrollea el sitio entero, con el acento de marca en vez de
 * un gris genérico.
 *
 * Sin `trigger` explícito: ScrollTrigger, sin uno, usa el documento
 * completo — `start`/`end` quedan en píxeles de scroll absolutos (0 →
 * altura total menos un viewport), que es exactamente "progreso de
 * toda la página", sin tener que calcular esa cuenta a mano ni
 * atarla a ninguna sección puntual.
 *
 * `gsap.set` directo sobre el ref en cada `onUpdate`, no React state:
 * esto corre en cada frame de scroll — pasar por `setState` dispararía
 * un re-render de React por cada tick, carísimo para algo que solo
 * necesita tocar un `transform` en el DOM. Solo se anima `scaleX`
 * (transform puro, regla dura de DESIGN.md §4.5), con
 * `transformOrigin: 'left'` para que crezca de izquierda a derecha en
 * vez de estirarse desde el centro.
 *
 * No respeta `prefers-reduced-motion` a propósito: no es una animación
 * autónoma que se dispara sola (lo que esa preferencia busca evitar),
 * es feedback 1:1 con el scroll que el usuario ya está haciendo con su
 * propia mano — apagarla sería sacar información, no movimiento
 * gratuito.
 *
 * `aria-hidden`: es un indicador visual redundante (la barra de scroll
 * nativa del navegador ya cumple ese rol para quien la necesite/pueda
 * verla) — no aporta nada a un lector de pantalla.
 */
export default function ScrollProgress() {
  // Selector de atributo, no `scope.current` — referenciar el ref del
  // propio scope DENTRO de su callback de inicialización dispara un
  // error de lint (react-hooks/immutability, variable usada antes de
  // declararse) aunque funcione en runtime. Mismo bug ya documentado
  // en DESIGN.md §5 para PortfolioCarousel.jsx.
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-scroll-progress]', { scaleX: 0, transformOrigin: 'left center' });

    const trigger = ScrollTrigger.create({
      start: 0,
      // 'max' (no un número/función a mano): el atajo documentado de
      // ScrollTrigger para "todo lo que se puede scrollear en la
      // página", que se recalcula solo en cada refresh. Con una
      // función propia (`() => scrollHeight - innerHeight`) sin
      // `trigger` explícito, el progreso quedaba mal calculado — daba
      // 100% de recorrido a mitad de página real, confirmado a mano en
      // el navegador.
      end: 'max',
      onUpdate: (self) => {
        gsap.set('[data-scroll-progress]', { scaleX: self.progress });
      },
    });

    return () => trigger.kill();
  });

  // Dos niveles, no uno: el selector de gsap.context() solo encuentra
  // DESCENDIENTES del elemento del scope, nunca el propio elemento del
  // scope aunque tenga el atributo puesto — si `data-scroll-progress`
  // viviera en el mismo <div ref={scope}>, sería exactamente ese bug
  // (mismo síntoma que ya se documentó para PortfolioCarousel.jsx en
  // DESIGN.md §5: "GSAP target not found" en consola). El wrapper de
  // afuera no tiene estilos propios — la barra adentro es `fixed`, así
  // que no depende de ningún layout que el wrapper pudiera aportar.
  return (
    <div ref={scope}>
      <div
        data-scroll-progress
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] w-full bg-gradient-to-r from-accent to-accent-light"
      />
    </div>
  );
}
