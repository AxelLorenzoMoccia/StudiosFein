import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import PortfolioLightbox from './PortfolioLightbox';

/* ============================================================
 *  ASSETS — fotos de "Piezas ya terminadas"
 * ============================================================
 *  src/assets/gallery/ (import.meta.glob): cualquier .jpg/.jpeg/.png/
 *  .webp que se agregue ahí aparece acá automáticamente, ordenado por
 *  nombre de archivo. Si se suman/sacan fotos, actualizar CAPTIONS
 *  abajo para que sigan correspondiendo en el mismo orden (sugerencia:
 *  nombrarlas "01-nombre.webp", "02-nombre.webp"...).
 * ============================================================ */
const galleryModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const galleryImages = Object.keys(galleryModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => galleryModules[key]);

// Copy por foto, en el mismo orden que los archivos ordenados arriba.
// Texto honesto sobre lo que se ve en cada imagen — nada de nombres de
// clientes o proyectos inventados. Dos de estas cuatro fotos (el
// sweater con etiqueta/puño bordado — "Punto gráfico" — y la campera
// con bordado en el respaldo — "Bordado en respaldo") son referencia
// de moodboard, no piezas fabricadas por Fein — el copy evita nombrar
// la marca/tipografía real que llevan bordada, para no terminar
// promocionando en el propio sitio un producto de otra marca.
const CAPTIONS = [
  { tag: '#Producto', title: 'Denim ancho', desc: 'Corte oversize, lavado desgastado — el volumen como identidad.' },
  { tag: '#Detalle', title: 'Punto gráfico', desc: 'Una tipografía difuminada, tejida directo en el punto.' },
  { tag: '#Producto', title: 'Canalé clásico', desc: 'Tejido grueso, cuello y puño reforzados — un básico bien resuelto.' },
  { tag: '#Detalle', title: 'Bordado en respaldo', desc: 'El texto como pieza gráfica, no solo como etiqueta.' },
];

const defaultItems = galleryImages.map((img, i) => ({ img, ...CAPTIONS[i % CAPTIONS.length] }));

/**
 * PORTFOLIO — "piezas ya terminadas", carrusel simple
 * -----------------------------------------------------
 * Versión anterior era un "coverflow" 3D: tarjetas de los costados
 * escalonadas en diagonal (`rotateY` + `perspective`), con un fondo
 * ambient desenfocado detrás. Pedido explícito del dueño de la marca:
 * "la ruleta de 4 prendas la quiere simple, que no esperen en diagonal
 * las fotos de atrás" — así que ahora es lo más chato posible: UNA
 * foto grande a la vez, cross-fade entre ellas, sin perspectiva ni
 * escalonado. Fotos en blanco y negro (`grayscale`), sin overlay de
 * texto encima de la imagen — el copy vive abajo, en texto plano.
 *
 * Sigue siendo navegable con flechas + puntos + swipe + teclado, y la
 * foto central sigue abriendo el lightbox al tocarla — mismo criterio
 * de siempre, solo que sin la escenografía 3D.
 */
export default function PortfolioCarousel({
  items = defaultItems,
  sectionLabel = 'TRABAJOS',
  autoplay = true,
  autoplayDelay = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const total = items.length;

  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-portfolio-section]', { opacity: 0, y: 48 });

    ScrollTrigger.create({
      trigger: '[data-portfolio-section]',
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to('[data-portfolio-section]', { opacity: 1, y: 0, duration: 0.8, ease: 'feinOut' }),
    });
  });

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => setCurrentIndex(idx % total);

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1 || lightboxIndex !== null) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, lightboxIndex, nextSlide, total]);

  const touchStartX = useRef(0);
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

  const current = items[currentIndex];
  const title = current.title;

  return (
    <section
      ref={scope}
      aria-roledescription="carrusel"
      aria-label={`Carrusel: ${sectionLabel.toLowerCase()}`}
      className="w-full bg-paper px-6 py-24 md:px-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div data-portfolio-section className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-light uppercase tracking-[0.3em] text-ink">
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
            {sectionLabel}
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-medium text-ink md:text-5xl">Piezas ya terminadas</h2>
        </div>

        {/* Foto — una sola a la vez, cross-fade simple, en blanco y
            negro. `role="button"` en vez de <button> por el mismo
            motivo de siempre: el reset de estilos default de <button>
            pisaría el layout de la imagen. */}
        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-linen">
          {items.map((item, idx) => (
            <img
              key={item.img}
              src={item.img}
              alt={item.title}
              loading={idx === 0 ? undefined : 'lazy'}
              role="button"
              tabIndex={idx === currentIndex ? 0 : -1}
              aria-label={`Ver más de ${item.title}`}
              onClick={() => (idx === currentIndex ? setLightboxIndex(idx) : goToSlide(idx))}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && idx === currentIndex) {
                  event.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover grayscale transition-opacity duration-700 ease-out"
              style={{
                opacity: idx === currentIndex ? 1 : 0,
                pointerEvents: idx === currentIndex ? 'auto' : 'none',
              }}
            />
          ))}
        </div>

        {/* Copy — texto plano debajo de la foto, no encima. */}
        <div className="mt-6 flex flex-col items-center gap-1 text-center">
          <span className="text-xs font-light uppercase tracking-[0.2em] text-ink">{current.tag}</span>
          <h3 className="text-xl font-medium text-ink">{title}</h3>
          {current.desc && <p className="mt-1 max-w-sm text-sm font-light text-ink">{current.desc}</p>}
        </div>

        {/* Flechas + puntos */}
        <div className="mt-8 flex items-center gap-6">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Pieza anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone text-ink transition-colors duration-200 hover:bg-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.img}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Ir a la pieza ${idx + 1}`}
                aria-current={idx === currentIndex}
                className={`h-2 rounded-full border-none transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  idx === currentIndex ? 'w-6 bg-ink' : 'w-2 bg-stone'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Pieza siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone text-ink transition-colors duration-200 hover:bg-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {lightboxIndex !== null && (
        <PortfolioLightbox item={items[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
}
