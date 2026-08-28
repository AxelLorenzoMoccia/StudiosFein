import { useGSAP } from '../hooks/useGSAP';

const SERVICES = [
  {
    n: '01',
    title: 'Identidad de marca',
    text: 'Logotipos, sistemas visuales y guías de marca pensadas para sostenerse en el tiempo, no solo para el lanzamiento.',
  },
  {
    n: '02',
    title: 'Diseño digital',
    text: 'Sitios y productos digitales con una premisa simple: que se sientan tan bien como se ven.',
  },
  {
    n: '03',
    title: 'Motion y producción',
    text: 'Animación, video y contenido en movimiento para que la marca no se quede quieta en ningún lado.',
  },
  {
    n: '04',
    title: 'Producto y merchandising',
    text: 'Objetos, prendas y piezas físicas que llevan la identidad de marca más allá de la pantalla.',
  },
];

/**
 * SERVICIOS — "qué hacemos"
 * --------------------------
 * Grilla de tarjetas con fade-up + stagger al entrar en viewport
 * (mismo patrón que AIGallery.jsx: ScrollTrigger.batch, un solo
 * listener por lote en vez de un ScrollTrigger por tarjeta).
 * Fondo claro — sigue el ritmo que arranca WeavyTransition.jsx justo
 * antes de esta sección.
 */
export default function ServicesSection() {
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-service-card]', { opacity: 0, y: 40 });

    ScrollTrigger.batch('[data-service-card]', {
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
  });

  return (
    <section ref={scope} className="w-full bg-neutral-50 px-6 py-24 text-neutral-950 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Servicios
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-semibold md:text-5xl">Qué hacemos</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.n}
              data-service-card
              className="group rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
            >
              <span className="text-sm font-medium tracking-widest text-accent">{service.n}</span>
              <h3 className="mt-4 text-xl font-semibold md:text-2xl">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{service.text}</p>
              <span className="mt-6 block h-px w-8 bg-neutral-200 transition-all duration-300 group-hover:w-16 group-hover:bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
