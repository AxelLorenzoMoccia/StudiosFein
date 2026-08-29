import { useMagnetic } from '../hooks/useMagnetic';
import ThemeToggle from './ThemeToggle';

/**
 * HEADER
 * -------
 * Nav fija y mínima: wordmark a la izquierda, link de contacto a la
 * derecha. Sin fondo propio — usa `mix-blend-mode: difference` sobre
 * texto blanco, así se auto-invierte según lo que haya scrolleando
 * debajo (blanco sobre las secciones oscuras, negro sobre las claras
 * como AIGallery/ServicesSection) sin necesidad de detectar con JS en
 * qué sección está el usuario. Es el mismo truco que usan sitios como
 * Stripe/Linear para una nav que "sabe" adaptarse sola.
 *
 * `focus-visible:outline` explícito en el link: el anillo de foco
 * default del navegador también entra en el `mix-blend-mode` del
 * header (hereda de un ancestro con ese blend), así que puede salir
 * con un color raro o directamente invisible según la sección de
 * fondo. Un outline blanco explícito con offset no depende de esa
 * mezcla — sigue siendo visible para navegación por teclado en
 * cualquier sección (regla CRÍTICA de accesibilidad, DESIGN.md §6:
 * "nunca outline: none sin un reemplazo visible" — acá directamente
 * no se saca el default, se refuerza).
 *
 * `useMagnetic()`: el link "tira" levemente hacia el mouse al
 * acercarse (se auto-desactiva en touch/reduced-motion, ver ese
 * hook) — uno de los pocos CTA del sitio con este tratamiento, no
 * todo lo clickeable.
 *
 * `<ThemeToggle />` vive agrupado con "Hablemos" en un mismo
 * contenedor a la derecha — `justify-between` en el <header> solo
 * separa DOS hijos directos (wordmark ↔ resto), así que todo lo que
 * va a la derecha ahora comparte un wrapper con `gap`.
 */
export default function Header() {
  const magneticRef = useMagnetic();

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-16"
      style={{ mixBlendMode: 'difference' }}
    >
      <span className="select-none text-lg font-semibold tracking-tight text-white">Fein</span>
      {/* Nota: acá NO se puede usar el dorado de acento — con
          mix-blend-mode: difference en el header, cualquier color que no
          sea blanco/negro sale distorsionado al mezclarse con el fondo.
          El "acento" queda en el subrayado animado en vez del color. */}
      <div className="flex items-center gap-5">
        <ThemeToggle />
        <a
          ref={magneticRef}
          href="#contacto"
          className="group pointer-events-auto inline-block rounded-sm text-sm font-medium tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Hablemos
          <span className="mt-0.5 block h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
        </a>
      </div>
    </header>
  );
}
