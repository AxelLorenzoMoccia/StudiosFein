import { useGSAP } from '../hooks/useGSAP';

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
 */
export default function ContactSection() {
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
    <section id="contacto" ref={scope} className="w-full bg-fein-dark px-6 py-32 text-center md:px-16">
      <p
        data-contact-reveal
        className="mb-5 flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-neutral-400"
      >
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        ¿Tenés un proyecto en mente?
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
      </p>
      <h2 data-contact-reveal className="text-4xl font-semibold text-white md:text-6xl">
        Hablemos.
      </h2>
      <p data-contact-reveal className="mx-auto mt-6 max-w-xl text-neutral-400">
        Contanos qué estás armando y vemos juntos cómo darle forma.
      </p>
      <a
        data-contact-reveal
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Contactar por mail a ${CONTACT_EMAIL}`}
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-wide text-neutral-950 transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-white"
      >
        Contactar
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </a>
    </section>
  );
}
