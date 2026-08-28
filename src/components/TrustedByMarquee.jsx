import { useState } from 'react';

/* ============================================================
 *  ASSETS — Logos de "Quienes confiaron en nosotros"
 * ============================================================
 *  Colocá los logos reales (idealmente en blanco/monocromo, SVG)
 *  en:
 *
 *      src/assets/logos/
 *
 *  Se importan y ordenan automáticamente acá abajo (import.meta.glob),
 *  igual que en AIGallery.jsx y MacbookSequenceSection.jsx. Mientras
 *  esa carpeta esté vacía, se muestran wordmarks de texto a modo de
 *  placeholder (ver PLACEHOLDER_BRANDS más abajo).
 *
 *  Para que un logo real quede clickeable, agregá su URL en
 *  BRAND_LINKS con la misma clave que el nombre del archivo (sin
 *  extensión) — ej. "src/assets/logos/nike.svg" → clave "nike". Si un
 *  logo no tiene entrada acá, simplemente no se renderiza como link
 *  (queda como imagen suelta, sin romper nada).
 * ============================================================ */
const logoModules = import.meta.glob('../assets/logos/*.{svg,png,webp}', {
  eager: true,
  import: 'default',
});

// Nombre → sitio oficial de la marca. Cubre los placeholders de abajo;
// sumar acá las marcas reales cuando se agreguen los logos.
const BRAND_LINKS = {
  Nike: 'https://www.nike.com',
  Adidas: 'https://www.adidas.com',
  Zara: 'https://www.zara.com',
  'H&M': 'https://www2.hm.com',
  "Levi's": 'https://www.levi.com',
  Uniqlo: 'https://www.uniqlo.com',
  Gap: 'https://www.gap.com',
  Bershka: 'https://www.bershka.com',
};

const realLogos = Object.keys(logoModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => {
    const name = key.split('/').pop().replace(/\.[^.]+$/, '');
    return { src: logoModules[key], name, url: BRAND_LINKS[name] };
  });

// Placeholders de texto — nombres de marcas de indumentaria conocidas,
// como wordmark tipográfico propio (no se reproduce ningún isotipo/
// logo real de marca, solo el nombre en texto plano) para no depender
// de artwork con derechos de autor mientras no estén los logos reales.
const PLACEHOLDER_BRANDS = Object.keys(BRAND_LINKS);

const hasRealLogos = realLogos.length > 0;
const logos = hasRealLogos
  ? realLogos
  : PLACEHOLDER_BRANDS.map((name) => ({ name, url: BRAND_LINKS[name] }));

// Se duplica la lista para que el loop de la animación sea perfecto:
// el track anima de translateX(0%) a translateX(-50%) — si el
// contenido está duplicado, ese -50% cae justo donde arranca la
// segunda copia, así que el corte es invisible.
const track = [...logos, ...logos];

const ITEM_CLASSNAME =
  'flex shrink-0 items-center justify-center rounded px-4 outline-none ' +
  'transition-transform duration-300 ease-out ' +
  'hover:z-10 hover:scale-125 focus-visible:z-10 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-white/60';

/**
 * TRUSTED BY MARQUEE — "Quienes confiaron en nosotros"
 * ------------------------------------------------------
 * Tren horizontal infinito de logos. La traslación es CSS puro
 * (`@keyframes` más abajo) — un loop continuo e independiente del
 * scroll, más liviano que animarlo con GSAP/rAF.
 *
 * El `@keyframes`/`animation` va en un `<style>` propio del componente
 * en vez de en tailwind.config.js a propósito: Tailwind no siempre
 * re-lee ese archivo en caliente con el server de dev ya corriendo
 * (nos pasó en este mismo proyecto — hacía falta reiniciar `npm run
 * dev` para que la animación apareciera). Con el `@keyframes` viviendo
 * acá al lado del componente que lo usa, no depende de esa
 * recompilación — siempre está.
 *
 * La PAUSA al hover se maneja con React (`isPaused` +
 * `animationPlayState` inline), no con `:hover` de CSS: así es
 * explícito que "hover en cualquier logo" frena TODO el tren, sin
 * depender de cómo el navegador resuelva la cascada.
 * `onMouseEnter`/`onMouseLeave` en el track (no en cada logo) usan la
 * semántica de `mouseenter` (no re-dispara al pasar de un logo a otro
 * adentro del track), así que no hay parpadeos al mover el mouse
 * dentro del tren.
 *
 * El logo puntual bajo el mouse además se agranda (`hover:scale-125`
 * en su propio `<a>`), sin afectar a los demás. Al salir, el tren
 * retoma el loop exactamente donde había quedado (no reinicia).
 *
 * Cada logo es un `<a target="_blank">` al sitio oficial de la marca
 * (ver BRAND_LINKS arriba) — clickeable.
 *
 * `prefers-reduced-motion`: en vez de apagar el movimiento del todo
 * (quedaba un tren de logos inmóvil, que se lee como roto), lo hace 3
 * veces más lento — sigue habiendo movimiento perceptible, solo que
 * mucho más suave para quien pidió menos animación.
 */
export default function TrustedByMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="w-full bg-fein-dark py-24">
      <style>{`
        @keyframes fein-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .fein-marquee-track {
          animation: fein-marquee 20s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .fein-marquee-track {
            animation-duration: 60s;
          }
        }
      `}</style>

      <h2 className="mb-14 text-center text-3xl font-semibold text-white md:text-5xl">
        Quienes confiaron en nosotros
      </h2>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="fein-marquee-track flex w-max items-center gap-16"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {track.map((logo, index) => {
            const content = hasRealLogos ? (
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className="h-8 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-10"
              />
            ) : (
              <span className="select-none whitespace-nowrap text-2xl font-bold tracking-tight text-neutral-500 opacity-70 transition-all duration-300 group-hover:text-white group-hover:opacity-100 md:text-3xl">
                {logo.name}
              </span>
            );

            const key = `${logo.name}-${index}`;

            return logo.url ? (
              <a
                key={key}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ir al sitio de ${logo.name}`}
                className={`group ${ITEM_CLASSNAME}`}
              >
                {content}
              </a>
            ) : (
              <div key={key} className={`group ${ITEM_CLASSNAME}`}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
