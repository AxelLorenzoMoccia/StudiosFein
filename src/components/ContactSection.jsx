import { useGSAP } from '../hooks/useGSAP';

// Email real de la agencia — sacado del pie "CONTACTO" del template de
// presupuesto que compartió el cliente (presupuesto 2.pdf), no
// inventado. El placeholder anterior (hola@fein.com) queda
// reemplazado.
const CONTACT_EMAIL = 'studiosfein@gmail.com';

/**
 * CONTACTO — cierre del sitio
 * -----------------------------
 * `id="contacto"` es el destino del link "Hablemos" del Header. Fade
 * up + stagger simple al entrar en viewport — la única animación que
 * queda en esta sección (se sacó el hover magnético del botón, pedido
 * explícito de "limpiar todo", ver App.jsx).
 *
 * `gsap.fromTo()` atómico, no `gsap.from()`: con `.from()` el botón
 * (último elemento del stagger) quedaba trabado en `opacity:0` para
 * siempre — confirmado en el navegador que el ScrollTrigger llegaba a
 * `progress:1` (la animación SÍ corría) pero el nodo real seguía con
 * `opacity:0` inline. `fromTo()` no tiene esa ambigüedad — el "hacia
 * dónde" queda explícito, sin adivinar.
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
    <section id="contacto" ref={scope} className="w-full bg-paper px-6 py-32 text-center md:px-16">
      <p
        data-contact-reveal
        className="mb-5 flex items-center justify-center gap-3 text-sm font-light uppercase tracking-[0.3em] text-ink"
      >
        <span className="h-px w-8 bg-stone" aria-hidden="true" />
        ¿Tenés un proyecto en mente?
        <span className="h-px w-8 bg-stone" aria-hidden="true" />
      </p>
      <h2 data-contact-reveal className="text-4xl font-medium text-ink md:text-6xl">
        Hablemos.
      </h2>
      <p data-contact-reveal className="mx-auto mt-6 max-w-xl font-light text-ink">
        Contanos qué estás armando y vemos juntos cómo darle forma.
      </p>
      <a
        data-contact-reveal
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Contactar por mail a ${CONTACT_EMAIL}`}
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-paper transition-opacity duration-300 hover:opacity-80"
      >
        Contactar
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </a>
    </section>
  );
}
