import { useGSAP } from '../hooks/useGSAP';

/**
 * Sección de ejemplo que se revela vinculada al scroll usando
 * ScrollTrigger. Sirve como referencia/plantilla para el resto
 * de las secciones informativas de la landing.
 *
 * - `scrub: true` liga el progreso de la animación 1:1 con el scroll
 *   (estilo Apple), en vez de dispararla una sola vez.
 */
export default function ScrollSection({ eyebrow, title, description, align = 'left' }) {
  const scope = useGSAP((gsap) => {
    gsap.from('[data-reveal]', {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '[data-reveal]',
        start: 'top 75%',
        end: 'top 30%',
        scrub: true,
        // markers: true, // útil para depurar mientras desarrollás
      },
    });
  });

  const alignment = align === 'right' ? 'items-end text-right' : 'items-start text-left';

  return (
    <section
      ref={scope}
      className="flex min-h-screen w-full items-center bg-neutral-950 px-6 py-24 md:px-16"
    >
      <div data-reveal className={`flex w-full max-w-2xl flex-col ${alignment}`}>
        {eyebrow && (
          <span className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-neutral-400 md:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
}
