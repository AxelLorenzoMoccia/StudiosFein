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
 *
 * OJO — dos bugs reales que tenía esto, los dos invisibles (nunca
 * tiraron un error):
 *
 * 1. La entrada (letras + línea + tagline) vivía DENTRO del mismo
 *    timeline scrubbeado que la salida. A scrollY=0 (recién entrando
 *    a la página, sin haber scrolleado un solo pixel) el progreso del
 *    timeline es 0 — el logo no aparecía hasta que el usuario
 *    scrolleaba.
 *
 * 2. Al separar entrada y salida en dos timelines, la salida seguía
 *    animando `opacity`/`filter`/`y` sobre LOS MISMOS elementos que
 *    la entrada (letras, línea, tagline) — y aunque las dos tenían
 *    `overwrite: false`, GSAP igual las pisaba entre sí apenas se
 *    creaba la segunda. La entrada quedaba trabada en su estado
 *    inicial invisible para siempre.
 *
 * La solución real para (2) no es pelear con `overwrite` — es que
 * nunca compitan en primer lugar: [data-intro-content] envuelve
 * letras + línea + tagline. La ENTRADA anima los elementos de
 * ADENTRO (granular, letra por letra). La SALIDA anima el
 * CONTENEDOR de afuera, un elemento que la entrada nunca toca. Cero
 * superposición posible — no hace falta pisar nada.
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

    // --- Entrada: autoplay al montar, NO atada al scroll ---
    // Un leve delay para que no "explote" apenas termina de pintar la
    // página — deja que el layout respire un instante antes de
    // arrancar. Posiciones con labels absolutos por el mismo motivo
    // de siempre (ver nota extensa en MacbookOpenReveal.jsx: el orden
    // de inserción de GSAP no garantiza el orden en el tiempo).
    gsap
      .timeline({ delay: 0.15 })
      .addLabel('resolve')
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
      .to('[data-intro-tagline]', { opacity: 1, y: 0, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.7');

    // --- Salida: sí atada al scroll (scrub) ---
    // Anima [data-intro-content] (el contenedor), no los elementos de
    // adentro — ver nota grande arriba sobre por qué.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '[data-intro-pin]',
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
      .addLabel('exit')
      // Espeja la entrada (desenfoca + sube) en vez de repetir el
      // zoom. `ease: 'none'` porque este tramo sí queda atado 1:1 al
      // scroll hasta el final del pin.
      .to(
        '[data-intro-content]',
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
          className="relative flex h-full w-full items-center justify-center will-change-transform"
        >
          <div data-intro-content className="flex flex-col items-center gap-6">
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
      </div>
    </section>
  );
}
