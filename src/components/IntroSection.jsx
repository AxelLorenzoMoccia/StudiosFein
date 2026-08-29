import { useGSAP } from '../hooks/useGSAP';

const LETTERS = ['F', 'e', 'i', 'n'];

/**
 * 1. INTRO — "hacer foco", no "acercar la cámara"
 * ==================================================
 * Versión anterior: el logo se desvanecía mientras toda la escena
 * hacía zoom in x6 — un truco de cámara ya muy visto. Esta apuesta a
 * otra cosa: el wordmark entra desenfocado, letra por letra, y hace
 * foco con precisión — como si algo impreciso se resolviera en algo
 * exacto. Debajo se traza una línea (el acento de marca, no un
 * subrayado decorativo cualquiera) y recién ahí aparece la tagline,
 * en ese orden, sin apuro. La salida es un espejo contenido de la
 * entrada (desenfoca de nuevo + deriva hacia arriba), no otro zoom
 * grande — la contención es la elegancia acá, no el movimiento
 * grande. La idea completa es transmitir precisión y cuidado sin
 * decir "precisión" ni "cuidado" en ningún lado.
 *
 * Estructura de capas: igual razón que siempre (ver nota histórica
 * abajo) — [data-intro-pin] es lo que GSAP pinea (h-screen +
 * overflow-hidden, la "ventana"), [data-intro-scale] es lo que
 * efectivamente escala un poco al final, adentro. El <section> de
 * afuera queda con altura automática para que el pin-spacer que GSAP
 * inserta pueda crecer y reservar el scroll real.
 *
 * Accesibilidad: partir "Fein" en 4 <span> (para el stagger letra por
 * letra) rompe cómo lo lee un screen reader si no se corrige — por
 * eso el `aria-label="Fein"` vive en el <h1> y cada letra individual
 * es `aria-hidden`.
 *
 * Fondo con atmósfera de color: nada de negro plano — dos glows
 * grandes, muy desenfocados, en dos tonos del MISMO dorado de marca
 * (`accent`/`accent-light` — no se suma un segundo acento, solo varía
 * la luminosidad, regla de la guía de diseño), a la deriva con un
 * loop lento e independiente del scroll (igual técnica que el
 * balanceo de la remera en MacbookOpenReveal.jsx: un `repeat:-1`
 * suelto, no metido en el timeline scrubbeado).
 */
export default function IntroSection() {
  const scope = useGSAP((gsap) => {
    gsap.set('[data-intro-letter]', { opacity: 0, filter: 'blur(20px)', y: 12 });
    gsap.set('[data-intro-line]', { scaleX: 0 });
    gsap.set('[data-intro-tagline]', { opacity: 0, y: 10 });

    // No hace falta guardar la referencia ni matarlas manualmente: al
    // vivir dentro del gsap.context() de useGSAP, `ctx.revert()` las
    // limpia solas al desmontar.
    gsap.to('[data-intro-glow-a]', {
      x: '12%',
      y: '-10%',
      scale: 1.15,
      duration: 9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to('[data-intro-glow-b]', {
      x: '-14%',
      y: '10%',
      scale: 1.2,
      duration: 11,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.2,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-intro-pin]',
        start: 'top top',
        end: '+=140%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Posiciones con labels absolutos (no `.to()` encadenados) — con
    // GSAP el orden de inserción no garantiza el orden en el tiempo;
    // los labels lo hacen explícito sin ambigüedad. Ver nota extensa
    // sobre esto en MacbookOpenReveal.jsx.
    tl.addLabel('resolve')
      // Las letras hacen foco con un leve stagger — "se ensambla con
      // precisión" en vez de aparecer todo junto de golpe.
      .to(
        '[data-intro-letter]',
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'feinOut', stagger: 0.05 },
        'resolve'
      )
      // La línea se traza mientras la última letra todavía está
      // asentando — se solapan un poco para que no se sienta como una
      // lista de pasos separados, sino una sola secuencia continua.
      .to('[data-intro-line]', { scaleX: 1, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.5')
      .to('[data-intro-tagline]', { opacity: 1, y: 0, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.7')
      // Hold: un tramo de scroll donde no pasa nada — se queda ahí,
      // sostenido, en vez de salir corriendo apenas termina de entrar.
      .addLabel('hold', 'resolve+=1.6')
      .addLabel('exit', 'hold+=0.6')
      // La salida espeja la entrada (desenfoca + sube) en vez de
      // repetir el zoom. `ease: 'none'` porque este tramo sí queda
      // atado 1:1 al scroll hasta el final del pin.
      .to(
        '[data-intro-letter], [data-intro-line], [data-intro-tagline]',
        { opacity: 0, filter: 'blur(16px)', y: -18, duration: 1, ease: 'none' },
        'exit'
      )
      // Un scale apenas perceptible (no 6x) — un empuje sutil hacia
      // la siguiente sección, no un viaje de cámara.
      .to('[data-intro-scale]', { scale: 1.08, duration: 1, ease: 'none' }, 'exit');
  });

  return (
    <section ref={scope} className="relative w-full bg-fein-dark">
      <div data-intro-pin className="relative h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            data-intro-glow-a
            className="absolute left-[8%] top-[12%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #d4b876 0%, transparent 70%)' }}
          />
          <div
            data-intro-glow-b
            className="absolute bottom-[8%] right-[8%] h-[50vmax] w-[50vmax] rounded-full opacity-40 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #b08b4f 0%, transparent 70%)' }}
          />
        </div>

        <div
          data-intro-scale
          className="relative flex h-full w-full flex-col items-center justify-center gap-6 will-change-transform"
        >
          <h1
            aria-label="Fein"
            className="flex select-none text-[20vw] font-semibold leading-none tracking-tight text-white md:text-[14vw]"
          >
            {LETTERS.map((letter, i) => (
              <span key={i} data-intro-letter aria-hidden="true" className="inline-block">
                {letter}
              </span>
            ))}
          </h1>

          <span
            data-intro-line
            aria-hidden="true"
            className="h-px w-24 bg-accent sm:w-32"
            style={{ transformOrigin: 'center' }}
          />

          <p
            data-intro-tagline
            className="select-none text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 sm:text-sm"
          >
            Estudio de diseño e identidad de marca
          </p>
        </div>
      </div>
    </section>
  );
}
