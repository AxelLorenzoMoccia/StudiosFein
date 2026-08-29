import { useGSAP } from '../hooks/useGSAP';

// Titular partido en renglones — cada uno vive en su propio overflow-hidden
// para el reveal tipo "cortina" (ver más abajo). `accent` es la porción de
// esa línea que se pinta con el dorado de marca.
const HEADLINE = [
  { text: 'No diseñamos para que se vea bien.' },
  { text: 'Lo hacemos para que ', accent: 'se sienta bien.' },
];

const PILLARS = [
  {
    n: '01',
    title: 'Intención',
    text: 'Cada decisión visual responde a un motivo concreto, nunca a una moda pasajera.',
  },
  {
    n: '02',
    title: 'Consistencia',
    text: 'La misma marca se sostiene igual en una pantalla, una prenda o una pared.',
  },
  {
    n: '03',
    title: 'Detalle',
    text: 'Lo que casi nadie nota a simple vista es, casi siempre, lo que más se termina sintiendo.',
  },
];

/**
 * STATEMENT — manifiesto de marca
 * ---------------------------------
 * Segunda parada del sitio (entre el logo de IntroSection y la Macbook):
 * antes era un bloque de 5 líneas de body-copy con el mismo peso visual,
 * un poco chato. Ahora tiene jerarquía editorial real —
 *
 *   eyebrow → titular grande (reveal "cortina") → bajada → línea de
 *   cierre a modo de firma → 3 pilares que sostienen el mensaje con
 *   argumentos concretos en vez de dejarlo en una frase linda.
 *
 * Sigue sin pin ni scrub (ver historia en el comentario que tenía este
 * archivo antes: se probó pineado y no convenció, alargaba la página).
 * Todo dispara una sola vez al entrar en viewport.
 */
export default function StatementSection() {
  const scope = useGSAP((gsap, ScrollTrigger) => {
    // Reveal "cortina": cada renglón arranca corrido hacia abajo dentro
    // de su overflow-hidden y desliza a su lugar — más premium que un
    // fade+translate plano, es el mismo truco de titular editorial que
    // usan Apple/Stripe/Linear. `feinOut` (ver useGSAP.js) en vez de un
    // power* genérico: entra con más carácter.
    gsap.fromTo(
      '[data-headline-inner]',
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: 'feinOut',
        stagger: 0.12,
        scrollTrigger: { trigger: '[data-headline]', start: 'top 80%' },
      }
    );

    gsap.from('[data-sub]', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-sub]', start: 'top 85%' },
    });

    gsap.from('[data-signature]', {
      opacity: 0,
      y: 12,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-signature]', start: 'top 88%' },
    });

    gsap.set('[data-pillar]', { opacity: 0, y: 32 });
    ScrollTrigger.batch('[data-pillar]', {
      start: 'top 88%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          overwrite: true,
        }),
    });

    // Glow de fondo detrás del titular — sutil, con vida propia
    // (pulsa despacio, sin relación con el scroll), no un elemento
    // estático. Mismo espíritu que la ola infinita de WeavyTransition
    // o el floating de AIGallery: nada en este sitio queda del todo
    // quieto.
    //
    // `prefers-reduced-motion`: puro ambiente, no informa nada — se
    // salta el pulso entero en vez de solo bajarle la velocidad (ver
    // el razonamiento completo en el comentario equivalente de
    // IntroSection.jsx). Auditoría pendiente que quedaba marcada en
    // DESIGN.md §6.
    let glow;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      glow = gsap.to('[data-glow]', {
        opacity: 0.6,
        scale: 1.15,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    return () => glow?.kill();
  });

  return (
    <section
      ref={scope}
      className="relative w-full overflow-hidden bg-fein-light px-6 py-28 md:px-16 md:py-36"
    >
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-accent/25 opacity-25 blur-[110px] md:h-[34rem] md:w-[34rem]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Manifiesto
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
        </span>

        <div data-headline className="flex flex-col">
          {HEADLINE.map((line) => (
            <div key={line.text} className="overflow-hidden py-1">
              <h2
                data-headline-inner
                className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {line.text}
                {line.accent && <span className="text-accent">{line.accent}</span>}
              </h2>
            </div>
          ))}
        </div>

        <p data-sub className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-xl">
          Cada marca que construimos tiene una intención clara detrás de cada trazo.
        </p>

        <div data-signature className="mt-10 flex items-center gap-4">
          <span className="h-px w-10 bg-neutral-900/15 dark:bg-white/15" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent dark:text-accent-light">
            Si todavía no se nota, no está terminada
          </span>
          <span className="h-px w-10 bg-neutral-900/15 dark:bg-white/15" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 md:mt-28">
        {PILLARS.map((pillar, index) => (
          <div
            key={pillar.n}
            data-pillar
            className={`flex flex-col gap-3 ${
              index > 0 ? 'sm:border-l sm:border-neutral-900/10 sm:pl-8 dark:sm:border-white/10' : ''
            }`}
          >
            <span className="text-sm font-medium tracking-widest text-accent">{pillar.n}</span>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white md:text-xl">{pillar.title}</h3>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{pillar.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
