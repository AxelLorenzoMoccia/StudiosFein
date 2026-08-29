import { useGSAP } from '../hooks/useGSAP';
import { useMagnetic } from '../hooks/useMagnetic';

// Placeholder — reemplazar por el mail real de la agencia cuando lo tengan.
const CONTACT_EMAIL = 'hola@fein.com';

/**
 * CONTACTO — cierre del sitio
 * -----------------------------
 * `id="contacto"` es el destino del link "Hablemos" del Header. Fade
 * up + stagger simple al entrar en viewport (no hace falta pin ni
 * scrub acá, es la última parada, no una secuencia).
 *
 * `gsap.fromTo()` atómico, no `gsap.from()`: con `.from()` el botón
 * (último elemento del stagger) quedaba trabado en `opacity:0` para
 * siempre — confirmado en el navegador que el ScrollTrigger llegaba a
 * `progress:1` (la animación SÍ corría) pero el nodo real seguía con
 * `opacity:0` inline. Mismo bug de fondo que ya documentó DESIGN.md §5
 * sobre el titular de StatementSection: `.from()` calcula el estado
 * "hacia dónde animar" a partir del valor computado ACTUAL en el
 * momento de crear el tween, y bajo el doble-montaje de React
 * StrictMode en dev ese valor puede leerse mal. `fromTo()` no tiene
 * esa ambigüedad — el "hacia dónde" queda explícito, sin adivinar.
 *
 * `useMagnetic()` vive en un <span> ENVOLVIENDO el botón, no en el
 * botón mismo — mismo motivo que la nota grande en IntroSection.jsx
 * sobre por qué dos tweens de GSAP nunca deben tocar el mismo
 * elemento: el botón ya es blanco de la animación de entrada (el
 * `fromTo` de `[data-contact-reveal]`, que anima su `y`). Aunque en
 * la práctica nunca compiten a la vez (el hover magnético recién
 * puede pasar después de que la entrada ya terminó), separarlos en
 * dos elementos distintos hace que la superposición sea imposible
 * por construcción, no por que "en teoría no debería pasar".
 *
 * El botón "Contactar" invierte su color sólido entre temas (oscuro
 * sobre claro / claro sobre oscuro), no solo ajusta tonos — el
 * original era un botón blanco sólido, pensado como el punto más
 * brillante contra un fondo casi negro; ese mismo blanco sobre el
 * nuevo fondo claro (`#faf9f6`) sería casi invisible (blanco sobre
 * casi-blanco). En claro pasa a un pill oscuro sólido, que cumple el
 * mismo rol de "el elemento más contrastado de la vista".
 */
export default function ContactSection() {
  const magneticRef = useMagnetic();
  const scope = useGSAP((gsap) => {
    gsap.fromTo(
      '[data-contact-reveal]',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '[data-contact-reveal]', start: 'top 80%' },
      }
    );
  });

  return (
    <section id="contacto" ref={scope} className="w-full bg-fein-light px-6 py-32 text-center md:px-16">
      <p
        data-contact-reveal
        className="mb-5 flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400"
      >
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        ¿Tenés un proyecto en mente?
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
      </p>
      <h2 data-contact-reveal className="text-4xl font-semibold text-neutral-900 dark:text-white md:text-6xl">
        Hablemos.
      </h2>
      <p data-contact-reveal className="mx-auto mt-6 max-w-xl text-neutral-600 dark:text-neutral-400">
        Contanos qué estás armando y vemos juntos cómo darle forma.
      </p>
      {/* Dos wrappers, no uno: el de afuera es el blanco de la
          animación de ENTRADA (opacity/y, `data-contact-reveal`), el
          de adentro es el blanco del hover MAGNÉTICO (x/y por mouse,
          `magneticRef`) — nunca el mismo elemento para las dos, por
          la nota grande de arriba. */}
      <span data-contact-reveal className="mt-10 inline-block">
        <span ref={magneticRef} className="inline-block">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={`Contactar por mail a ${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-accent dark:bg-white dark:text-neutral-950 dark:hover:bg-accent dark:hover:text-white"
          >
            Contactar
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
        </span>
      </span>
    </section>
  );
}
