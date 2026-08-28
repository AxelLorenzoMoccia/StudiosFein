import { useGSAP } from '../hooks/useGSAP';

const LINES = [
  'Fein es un estudio de diseño e identidad de marca.',
  'No hacemos diseño para que se vea bien.',
  'Lo hacemos para que se sienta bien.',
  'Cada marca que construimos tiene una intención clara detrás de cada trazo.',
  'Si todavía no se nota, no está terminada.',
];

/**
 * STATEMENT — manifiesto de marca
 * ----------------------------------
 * Antes esto era un texto pineado con crossfade línea por línea
 * (5 pantallas de scroll para leer 5 frases). Se sacó: alargaba la
 * página muchísimo y el efecto no convencía. Ahora es un bloque
 * estático de toda la vida — todas las frases visibles a la vez,
 * mismo trato tipográfico y de reveal que el resto del sitio (fade-up
 * + stagger al entrar en viewport, sin pin, sin scrub).
 */
export default function StatementSection() {
  const scope = useGSAP((gsap) => {
    gsap.from('[data-line]', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '[data-line]', start: 'top 85%' },
    });
  });

  return (
    <section ref={scope} className="w-full bg-fein-dark px-6 py-28 md:px-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {LINES.map((text) => (
          <p
            key={text}
            data-line
            className="text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl"
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
