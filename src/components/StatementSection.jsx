import { useGSAP } from '../hooks/useGSAP';

const LINES = [
  'Fein es un estudio de diseño e identidad de marca.',
  'No hacemos diseño para que se vea bien.',
  'Lo hacemos para que se sienta bien.',
  'Cada marca que construimos tiene una intención clara detrás de cada trazo.',
  'Si todavía no se nota, no está terminada.',
];

/**
 * STATEMENT — manifiesto con texto revelado por scroll
 * ------------------------------------------------------
 * Todas las frases ocupan el MISMO punto central (absolute, todas
 * superpuestas) — no una debajo de la otra — para que da igual cuánto
 * mida cada una, nunca desbordan el viewport ni se solapan
 * visualmente. Solo una está "encendida" (opacity 1, sin blur) por
 * vez; el resto quedan atenuadas de fondo. A medida que se scrollea
 * dentro del pin, la frase activa se apaga y la siguiente se enciende
 * — la técnica de "texto en foco" que usan Stripe/Linear en sus
 * secciones de storytelling.
 *
 * Las posiciones del timeline son NÚMEROS ABSOLUTOS (no `.to()`
 * encadenados) a propósito: con GSAP, encadenar tweens depende del
 * ORDEN en que se agregan, no de a qué tiempo corresponden — usar
 * posiciones absolutas evita ese problema por completo, sin importar
 * en qué orden se llame a `.to()` cada línea cae exactamente donde
 * tiene que caer.
 */
export default function StatementSection({ scrollLength = LINES.length, debug = false }) {
  const scope = useGSAP(
    (gsap) => {
      const lines = gsap.utils.toArray('[data-line]');
      if (!lines.length) return undefined;

      gsap.set(lines, { opacity: 0.16, filter: 'blur(6px)' });
      gsap.set(lines[0], { opacity: 1, filter: 'blur(0px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-statement-pin]',
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: debug,
        },
      });

      lines.forEach((line, i) => {
        if (i === 0) return;
        const at = i; // posición absoluta — ver nota arriba
        tl.to(lines[i - 1], { opacity: 0.16, filter: 'blur(6px)', duration: 0.8 }, at).to(
          line,
          { opacity: 1, filter: 'blur(0px)', duration: 0.8 },
          at
        );
      });
    },
    [scrollLength, debug]
  );

  return (
    <section ref={scope} className="relative w-full bg-fein-dark">
      <div
        data-statement-pin
        className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-16"
      >
        <div className="relative mx-auto w-full max-w-4xl" style={{ minHeight: '10rem' }}>
          {LINES.map((text) => (
            <p
              key={text}
              data-line
              className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center font-serif text-3xl italic leading-snug text-white sm:text-4xl md:text-5xl"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
