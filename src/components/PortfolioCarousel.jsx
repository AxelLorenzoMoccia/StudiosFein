import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { useMagnetic } from '../hooks/useMagnetic';
import { useTheme } from '../hooks/useTheme';
import PortfolioLightbox from './PortfolioLightbox';

/* ============================================================
 *  ASSETS — mismas fotos que AIGallery.jsx
 * ============================================================
 *  Reusa src/assets/gallery/ (import.meta.glob, mismo patrón que
 *  ese componente): cualquier .jpg/.jpeg/.png/.webp que se agregue
 *  ahí aparece acá automáticamente, ordenado por nombre de archivo.
 *  Si el día de mañana se suman/sacan fotos, actualizar CAPTIONS
 *  abajo para que seden con el nuevo orden (mismo criterio de
 *  "sugerencia: 01-nombre.webp, 02-nombre.webp..." que ya usa
 *  AIGallery).
 * ============================================================ */
const galleryModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const galleryImages = Object.keys(galleryModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => galleryModules[key]);

// Copy por foto, en el mismo orden que los archivos ordenados arriba
// (01-textura, 02-remera, 04-boceto, 05-bordado). Texto honesto sobre
// lo que se ve en cada imagen — nada de nombres de clientes o
// proyectos inventados (DESIGN.md §7/§8: se respeta el criterio de no
// fabricar contenido que no fue provisto).
const CAPTIONS = [
  {
    tag: '#Materiales',
    titleLine1: 'TEXTURA',
    titleLine2: 'NATURAL',
    desc: 'Lino crudo — el punto de partida antes de cualquier estampa.',
  },
  {
    tag: '#Producto',
    titleLine1: 'PRENDA',
    titleLine2: 'EN BLANCO',
    desc: 'El lienzo antes de la identidad. Todo proyecto arranca así.',
  },
  {
    tag: '#Proceso',
    titleLine1: 'BOCETO',
    titleLine2: 'A MANO',
    desc: 'Antes de la pantalla, siempre hay un lápiz.',
  },
  {
    tag: '#Detalle',
    titleLine1: 'BORDADO',
    titleLine2: 'ARTESANAL',
    desc: 'El detalle que se nota de cerca, aunque nadie lo señale.',
  },
];

const defaultItems = galleryImages.map((img, i) => ({ img, ...CAPTIONS[i % CAPTIONS.length] }));

// Geometría del "coverflow" en dos tamaños — desktop (tal cual el
// original) y una versión más compacta para mobile, así las tarjetas
// de los costados no se van tan lejos del viewport en 375px (nunca
// scroll horizontal, regla ALTA de DESIGN.md §6 — la sección igual
// queda `overflow-hidden` como cinturón de seguridad, pero con la
// versión desktop de las distancias el "peek" de las tarjetas
// laterales quedaba desproporcionado en pantallas chicas).
const LAYOUT = {
  desktop: {
    card: { width: 330, height: 500 },
    stageHeight: 520,
    near: { x: 285, scale: 0.84, rotate: 24 },
    far: { x: 510, scale: 0.68, rotate: 38 },
  },
  mobile: {
    card: { width: 224, height: 340 },
    stageHeight: 380,
    near: { x: 150, scale: 0.78, rotate: 20 },
    far: { x: 250, scale: 0.6, rotate: 30 },
  },
};

/**
 * 6. PORTFOLIO — carrusel "coverflow" 3D
 * -----------------------------------------
 * Adaptado de "3D Coverflow Carousel" de 21st.dev (vía MCP, cuenta
 * `sshahaider` — no se pudo confirmar el link exacto del componente
 * en esta sesión porque el conector de 21st.dev no estaba autorizado,
 * pero el pedido lo trajo pegado directo del código fuente), reescrito
 * sin TypeScript, sin "use client" (irrelevante en Vite), con íconos
 * de `lucide-react` en vez de SVGs a mano, y recoloreado con los
 * tokens de Fein (`accent`/`accent-light`, `bg-fein-light`) en vez de
 * la paleta dorada genérica del original — mismo criterio que ya se
 * usó para adaptar el componente de ServicesSection.jsx.
 *
 * El contenido demo original era un menú de restaurant con fotos de
 * Unsplash — se reemplazó por las 4 fotos reales que ya vivían en
 * src/assets/gallery/ (las mismas de AIGallery.jsx, hoy sin usar) en
 * vez de bajar fotos de stock sin relación con Fein (DESIGN.md §8:
 * partir de lo que ya existe en el repo, no inventar/traer assets
 * ajenos a la marca).
 *
 * Cambios de comportamiento respecto al original:
 * - Se sacó el listener de flechas de teclado en `window`: escuchaba
 *   ArrowLeft/ArrowRight globalmente sin importar si el carrusel
 *   estaba siquiera en pantalla, lo que secuestraba esas teclas en
 *   toda la página (ej. si el usuario las usa para otra cosa
 *   mientras este carrusel simplemente está montado más abajo). La
 *   navegación por teclado sigue andando igual vía Tab + Enter/Space
 *   sobre los botones de flecha y los puntos — foco visible incluido
 *   (regla CRÍTICA de accesibilidad, DESIGN.md §6).
 * - El autoplay respeta `prefers-reduced-motion` (chequeo puntual acá
 *   porque es la única animación de scroll infinito no atada a
 *   `useGSAP`/ScrollTrigger del sitio en tener movimiento continuo
 *   automático — el resto del audit sitewide de esta preferencia
 *   sigue pendiente, ver DESIGN.md §6).
 * - Geometría de tarjetas responsive (LAYOUT arriba) en vez de
 *   distancias fijas en px pensadas solo para desktop.
 *
 * Entrada: como cualquier otra sección nueva del sitio, un fade-up al
 * entrar en viewport (mismo lenguaje de motion que el resto, en vez
 * de aparecer de golpe) — la mecánica interna del carrusel (arrastre
 * entre tarjetas, autoplay) sigue con transiciones CSS propias, como
 * en el original: son muchas piezas de estado coordinadas
 * (autoplay + hover + touch + click-to-navigate) y reescribirlas en
 * GSAP no sumaba nada sobre una máquina de estados que ya funciona
 * bien — el criterio de "no hace falta GSAP para algo ya
 * determinístico" es el mismo que se usó para el hover del logo en
 * IntroSection.jsx.
 *
 * Tarjeta central clickeable → abre PortfolioLightbox.jsx (la pieza
 * ampliada, con su copy completo y un CTA de contacto). Antes tocar
 * el centro no hacía nada — un carrusel que no llevaba a ningún lado.
 * Las tarjetas de los costados siguen navegando al tocarlas
 * (`goToSlide`), como ya hacían.
 *
 * Las tarjetas son `role="button"` + `tabIndex` + `onKeyDown` (Enter/
 * Espacio), no un `<div onClick>` sin más — antes no eran operables
 * por teclado en absoluto (ni Tab las alcanzaba). Se evitó envolver
 * en un `<button>` real porque el reset de estilos default de ese
 * elemento (fondo, borde, padding) hubiera pisado el layout absoluto
 * de la tarjeta; el patrón role+tabIndex+keydown da la misma
 * semántica sin ese arrastre.
 */
export default function PortfolioCarousel({
  items = defaultItems,
  sectionLabel = 'TRABAJOS',
  autoplay = true,
  autoplayDelay = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(0);
  const total = items.length;
  const prevMagneticRef = useMagnetic();
  const nextMagneticRef = useMagnetic();
  // El gradiente ambiente de fondo (abajo) es demasiado dinámico para
  // CSS puro (`dark:` no ayuda acá) — depende de saber el tema activo
  // desde JS. Ver useTheme.js.
  const isDark = useTheme();

  // `[data-portfolio-section]` vive en el div de CONTENIDO, no en el
  // <section ref={scope}> de más afuera — el selector de
  // gsap.context() sólo busca DESCENDIENTES del elemento del scope,
  // nunca el propio elemento del scope (aunque tenga el atributo). Ya
  // pisamos este bug (con otro síntoma) documentado en DESIGN.md §5;
  // acá el síntoma era "GSAP target [data-portfolio-section] not
  // found" en consola porque el atributo estaba en el <section> raíz.
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-portfolio-section]', { opacity: 0, y: 48 });

    ScrollTrigger.create({
      trigger: '[data-portfolio-section]',
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to('[data-portfolio-section]', { opacity: 1, y: 0, duration: 0.8, ease: 'feinOut' }),
    });
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx % total);
  };

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1 || lightboxIndex !== null) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, lightboxIndex, nextSlide, total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  const layout = isMobile ? LAYOUT.mobile : LAYOUT.desktop;

  return (
    <section
      ref={scope}
      aria-roledescription="carrusel"
      aria-label={`Carrusel: ${sectionLabel.toLowerCase()}`}
      className="relative w-full overflow-hidden bg-fein-light px-6 py-24 md:px-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambiente de fondo — la misma foto del centro, desenfocada, para
          dar continuidad de color detrás del stage. El nivel de
          oscurecimiento cambia con el tema (por eso `isDark` desde JS,
          no `dark:` — el gradiente es demasiado dinámico para CSS puro):
          en oscuro sigue siendo el vignette casi negro original; en
          claro es mucho más sutil, la foto se apaga hacia el tono base
          del sitio en vez de hacia negro. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={items[currentIndex]?.img}
          alt=""
          className="h-full w-full scale-110 object-cover transition-[filter] duration-1000 ease-out"
          style={{ filter: isDark ? 'brightness(0.22) blur(32px)' : 'brightness(0.92) blur(32px) saturate(0.9)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(circle at center, rgba(7,7,7,0.3) 0%, rgba(7,7,7,0.92) 100%)'
              : 'radial-gradient(circle at center, rgba(250,249,246,0.35) 0%, rgba(250,249,246,0.95) 100%)',
          }}
        />
      </div>

      <div data-portfolio-section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {sectionLabel}
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-semibold md:text-5xl">Piezas ya terminadas</h2>
        </div>

        {/* Stage 3D */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{ height: `${layout.stageHeight}px`, perspective: '1400px' }}
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = 'translateX(0px) scale(0.4) rotateY(0deg)';
            let opacity = 0;
            let zIndex = 0;
            let filter = 'brightness(0.4) blur(2px)';
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = 'translateX(0px) scale(1) rotateY(0deg)';
              opacity = 1;
              zIndex = 30;
              filter = 'brightness(1)';
            } else if (offset === 1) {
              transform = `translateX(${layout.near.x}px) scale(${layout.near.scale}) rotateY(-${layout.near.rotate}deg)`;
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === 2) {
              transform = `translateX(${layout.far.x}px) scale(${layout.far.scale}) rotateY(-${layout.far.rotate}deg)`;
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            } else if (offset === total - 1) {
              transform = `translateX(-${layout.near.x}px) scale(${layout.near.scale}) rotateY(${layout.near.rotate}deg)`;
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === total - 2) {
              transform = `translateX(-${layout.far.x}px) scale(${layout.far.scale}) rotateY(${layout.far.rotate}deg)`;
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            }

            const title = `${item.titleLine1}${item.titleLine2 ? ` ${item.titleLine2}` : ''}`;
            const handleActivate = () => (isCenter ? setLightboxIndex(idx) : goToSlide(idx));

            return (
              <div
                key={item.img}
                role="button"
                tabIndex={0}
                aria-label={isCenter ? `Ver más de ${title}` : `Ir a ${title}`}
                onClick={handleActivate}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleActivate();
                  }
                }}
                className="absolute overflow-hidden rounded-[18px] border border-neutral-900/10 bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light dark:border-white/10"
                style={{
                  width: `${layout.card.width}px`,
                  height: `${layout.card.height}px`,
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: 'center center',
                  transition: 'all 800ms cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: isCenter
                    ? '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(176,139,79,0.25)'
                    : '0 15px 35px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                }}
              >
                <img src={item.img} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />

                <div
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.96) 100%)',
                  }}
                />

                <div
                  className="relative z-20 flex h-full w-full flex-col justify-between px-4 py-5 text-center transition-[opacity,transform] duration-500 ease-out"
                  style={{
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? 'translateY(0px)' : 'translateY(16px)',
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  <div className="w-full pr-1 text-right">
                    <span className="text-[0.78rem] font-semibold tracking-wide text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]">
                      {item.tag}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col items-center gap-1 pb-1">
                    <h3 className="m-0 text-2xl font-black uppercase leading-[1.1] tracking-wide text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95)]">
                      {item.titleLine1}
                    </h3>

                    {item.titleLine2 && (
                      <span className="text-lg font-bold uppercase leading-tight tracking-wide text-neutral-100 [text-shadow:0_3px_10px_rgba(0,0,0,0.9)]">
                        {item.titleLine2}
                      </span>
                    )}

                    <div className="my-1.5 h-0.5 w-8 rounded-full bg-accent-light shadow-[0_0_8px_rgba(212,184,118,0.7)]" />

                    {item.desc && (
                      <p className="m-0 max-w-[280px] text-[0.82rem] italic leading-tight text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flechas — el posicionamiento (top-1/2 + -translate-y-1/2) vive
            en un <div> envolvente, no en el <button>: el <button> es el
            blanco del hover magnético (useMagnetic anima su transform
            x/y), y un `transform` de Tailwind en el mismo elemento se
            pisaría con el que escribe GSAP inline (mismo motivo por el
            que el CTA de ContactSection usa dos wrappers separados). Por
            el mismo choque se sacó el `hover:scale-105` — el tirón
            magnético ya es el feedback de hover acá. */}
        <div className="absolute left-2 top-1/2 z-40 -translate-y-1/2 sm:left-6">
          <button
            ref={prevMagneticRef}
            type="button"
            onClick={prevSlide}
            aria-label="Diseño anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        </div>

        <div className="absolute right-2 top-1/2 z-40 -translate-y-1/2 sm:right-6">
          <button
            ref={nextMagneticRef}
            type="button"
            onClick={nextSlide}
            aria-label="Diseño siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        {/* Paginación */}
        <div className="z-30 mt-8 flex items-center justify-center gap-2">
          {items.map((item, idx) => (
            <button
              key={item.img}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Ir a la pieza ${idx + 1}`}
              aria-current={idx === currentIndex}
              className={`h-2 rounded-full border-none transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:focus-visible:outline-white ${
                idx === currentIndex
                  ? 'w-7 bg-accent-light shadow-[0_0_10px_rgba(212,184,118,0.7)]'
                  : 'w-2 bg-neutral-900/25 dark:bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <PortfolioLightbox item={items[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
}
