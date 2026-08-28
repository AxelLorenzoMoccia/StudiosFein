import { useGSAP } from '../hooks/useGSAP';

/* ============================================================
 *  ASSETS — Galería de fotos generadas por IA
 * ============================================================
 *  Colocá las imágenes finales en:
 *
 *      src/assets/gallery/
 *
 *  Cualquier .jpg/.jpeg/.png/.webp que pongas ahí aparece acá
 *  automáticamente (import.meta.glob), ordenado por nombre de
 *  archivo — sugerencia: 01-retrato.webp, 02-textura.webp, etc.
 * ============================================================ */
const galleryModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const galleryImages = Object.keys(galleryModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => galleryModules[key]);

// Índice (0-based) de la imagen que va a tener la animación infinita
// ("floating" + escala continua) para que parezca que cobra vida.
const FLOATING_IMAGE_INDEX = 2;

// Placeholder de desarrollo: se usa solo mientras no haya imágenes
// reales en la carpeta de arriba, para poder ver el layout/animación
// funcionando igual. Se puede borrar junto con el `if` de abajo.
const PLACEHOLDER_COUNT = 8;
const placeholderItems = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => i);

/**
 * 4. GALERÍA IA
 * -------------
 * Grilla de imágenes que se revelan con fade-up + stagger a medida
 * que van entrando en viewport (ScrollTrigger.batch, más performante
 * que crear un ScrollTrigger individual por cada foto). Una foto
 * puntual (`FLOATING_IMAGE_INDEX`) recibe además una animación
 * infinita y suave (float + scale) que corre en paralelo, sin
 * relación con el scroll.
 */
export default function AIGallery() {
  const hasRealImages = galleryImages.length > 0;
  const items = hasRealImages ? galleryImages : placeholderItems;

  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-gallery-item]', { opacity: 0, y: 48 });

    ScrollTrigger.batch('[data-gallery-item]', {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          overwrite: true,
        }),
    });

    // Animación infinita: leve "floating" + escala continua (yoyo).
    gsap.to('[data-float-image]', {
      y: -18,
      scale: 1.05,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <section
      ref={scope}
      className="w-full bg-neutral-50 px-6 py-24 text-neutral-950 md:px-16"
    >
      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Exploración
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
        </span>
        <h2 className="text-3xl font-semibold md:text-5xl">Explorado con IA</h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {items.map((item, index) => {
          const isFloating = index === FLOATING_IMAGE_INDEX;

          return (
            <div
              key={hasRealImages ? item : `placeholder-${item}`}
              data-gallery-item
              className={`group relative aspect-square overflow-hidden rounded-xl bg-neutral-200 ${
                isFloating ? 'ring-1 ring-accent/50' : ''
              }`}
            >
              {hasRealImages ? (
                <img
                  data-float-image={isFloating ? '' : undefined}
                  src={item}
                  alt={`Pieza generada con IA #${index + 1}`}
                  className={`h-full w-full object-cover ${
                    isFloating ? '' : 'transition-transform duration-500 group-hover:scale-110'
                  }`}
                  loading="lazy"
                />
              ) : (
                // TODO: este <div> es solo un placeholder visual — se
                // reemplaza solo por <img> reales apenas haya archivos
                // en src/assets/gallery/ (ver comentario de assets arriba).
                <div
                  data-float-image={isFloating ? '' : undefined}
                  className="flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed border-neutral-400 p-2 text-center text-xs text-neutral-500"
                >
                  <span>Imagen IA #{index + 1}</span>
                  <span className="text-[10px]">(agregar en src/assets/gallery/)</span>
                </div>
              )}

              {hasRealImages && (
                <span className="pointer-events-none absolute bottom-3 left-3 text-xs font-medium tracking-widest text-white opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
