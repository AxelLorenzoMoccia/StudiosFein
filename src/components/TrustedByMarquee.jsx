import { useState } from 'react';
import ClientGallery from './ClientGallery';
import shatoDog from '../assets/clients/shato/01-shato-dog.webp';
import shatoHeavenSent from '../assets/clients/shato/02-shato-heavensent.webp';

/* ============================================================
 *  ASSETS — Logos de "Quienes confiaron en nosotros"
 * ============================================================
 *  Colocá los logos reales (idealmente en negro/monocromo, SVG) en:
 *
 *      src/assets/logos/
 *
 *  Se importan y ordenan automáticamente acá abajo (import.meta.glob),
 *  igual que en PortfolioCarousel.jsx. Mientras esa carpeta esté
 *  vacía, se muestran wordmarks de texto a modo de placeholder (ver
 *  PLACEHOLDER_BRANDS más abajo).
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

// Nombre → sitio oficial del cliente REAL correspondiente. Vacío por
// default a propósito — no fabricar clientes que no fueron confirmados.
const BRAND_LINKS = {};

/* ============================================================
 *  TRABAJO POR CLIENTE — "ver todos los diseños hechos para esa
 *  marca" (pedido explícito, 31 ago 2026)
 * ============================================================
 *  Nombre EXACTO del cliente (tal como aparece acá) → sus piezas.
 *  Solo entra acá un cliente si hay evidencia real de que lo es —
 *  "Shato" salió del propio catálogo de servicios del cliente
 *  (studiosfein.pdf, sección "Mockups profesionales": dos estampas
 *  reales con el tag "SHATO STUDIO" cosido en la prenda). El resto de
 *  la lista de abajo (CLIENTE 02...08) sigue siendo placeholder
 *  honesto — no hay body of work real para atribuirles todavía, así
 *  que quedan sin clickear en vez de fingir una galería que no existe.
 *  Agregar acá un cliente real ↔ agregar su nombre en CLIENT_NAMES lo
 *  vuelve clickeable automáticamente.
 * ============================================================ */
const CLIENT_WORK = {
  Shato: [
    { img: shatoDog, title: 'Estampa "Shato" — ilustración + tipografía' },
    { img: shatoHeavenSent, title: 'Estampa "Heaven Sent"' },
  ],
};

// Un cliente real (Shato) + placeholders honestos para el resto —
// mismo criterio de siempre: nombrar solo lo que está confirmado.
const CLIENT_NAMES = ['Shato', 'CLIENTE 02', 'CLIENTE 03', 'CLIENTE 04', 'CLIENTE 05', 'CLIENTE 06', 'CLIENTE 07'];

const realLogos = Object.keys(logoModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => {
    const name = key.split('/').pop().replace(/\.[^.]+$/, '');
    return { src: logoModules[key], name, url: BRAND_LINKS[name] };
  });

const hasRealLogos = realLogos.length > 0;
const logos = hasRealLogos ? realLogos : CLIENT_NAMES.map((name) => ({ name, url: undefined }));

// Se duplica la lista para que el loop de la animación sea perfecto:
// el track anima de translateX(0%) a translateX(-50%) — si el
// contenido está duplicado, ese -50% cae justo donde arranca la
// segunda copia, así que el corte es invisible.
const track = [...logos, ...logos];

const ITEM_CLASSNAME =
  'flex shrink-0 items-center justify-center rounded px-4 outline-none ' +
  'transition-transform duration-300 ease-out ' +
  'hover:z-10 hover:scale-125 focus-visible:z-10 focus-visible:scale-125 focus-visible:ring-2 ' +
  'focus-visible:ring-ink/60';

/**
 * TRUSTED BY MARQUEE — "Quienes confiaron en nosotros"
 * ------------------------------------------------------
 * Tren horizontal infinito de logos. La traslación es CSS puro
 * (`@keyframes` más abajo) — un loop continuo e independiente del
 * scroll, más liviano que animarlo con GSAP/rAF.
 *
 * La PAUSA al hover se maneja con React (`isPaused` +
 * `animationPlayState` inline), no con `:hover` de CSS: así es
 * explícito que "hover en cualquier logo" frena TODO el tren.
 *
 * Clickeable SOLO donde hay trabajo real registrado (`CLIENT_WORK`) —
 * toca uno de esos y se abre `ClientGallery.jsx` con las piezas.
 * Los placeholders sin trabajo real quedan como texto simple, sin
 * `role="button"` ni cursor de puntero — no hay nada real que abrir
 * ahí todavía.
 *
 * `prefers-reduced-motion`: en vez de apagar el movimiento del todo
 * (queda un tren de logos inmóvil, que se lee como roto), lo hace 3
 * veces más lento — sigue habiendo movimiento perceptible, mucho más
 * suave para quien pidió menos animación.
 */
export default function TrustedByMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [openClient, setOpenClient] = useState(null);

  return (
    <section className="w-full bg-paper py-24">
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

      <div className="mb-14 flex flex-col items-center gap-4 text-center">
        <span className="flex items-center gap-3 text-xs font-light uppercase tracking-[0.3em] text-ink">
          <span className="h-px w-8 bg-stone" aria-hidden="true" />
          Confianza
          <span className="h-px w-8 bg-stone" aria-hidden="true" />
        </span>
        <h2 className="text-3xl font-medium text-ink md:text-5xl">Quienes confiaron en nosotros</h2>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="fein-marquee-track flex w-max items-center gap-16"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {track.map((logo, index) => {
            const work = CLIENT_WORK[logo.name];
            const isClickable = !hasRealLogos && !!work;

            const content = hasRealLogos ? (
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className="h-8 w-auto object-contain opacity-60 grayscale transition-opacity duration-300 group-hover:opacity-100 md:h-10"
              />
            ) : (
              // `ash` (#8B8B8B) da 3.35:1 contra `paper` — por debajo
              // del 4.5:1 de texto normal, pero este texto es grande
              // (24px+, "texto grande" en WCAG solo pide 3:1) así que
              // pasa. `ash` NO se usa para texto chico en ningún otro
              // lado del sitio por el mismo motivo.
              <span className="select-none whitespace-nowrap text-2xl font-medium tracking-tight text-ash transition-colors duration-300 group-hover:text-ink md:text-3xl">
                {logo.name}
              </span>
            );

            const key = `${logo.name}-${index}`;

            if (isClickable) {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOpenClient(logo.name)}
                  aria-label={`Ver el trabajo realizado para ${logo.name}`}
                  className={`group ${ITEM_CLASSNAME}`}
                >
                  {content}
                </button>
              );
            }

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

      {openClient && CLIENT_WORK[openClient] && (
        <ClientGallery name={openClient} items={CLIENT_WORK[openClient]} onClose={() => setOpenClient(null)} />
      )}
    </section>
  );
}
