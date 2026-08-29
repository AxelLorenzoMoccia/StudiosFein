import { useGSAP } from '../hooks/useGSAP';

const LETTERS = ['F', 'e', 'i', 'n'];

/**
 * 1. INTRO — "hacer foco", sin salida
 * ======================================
 * El wordmark entra desenfocado, letra por letra, y hace foco con
 * precisión — como si algo impreciso se resolviera en algo exacto.
 * Debajo se traza una línea (el acento de marca) y recién ahí aparece
 * la tagline, en ese orden, sin apuro.
 *
 * A pedido explícito: el logo NO se desvanece al scrollear. Antes
 * había una segunda mitad de la animación (atada al scroll, con pin)
 * que la desenfocaba y desvanecía de nuevo al salir — se sacó por
 * completo. Ahora es una sección normal: aparece una vez al cargar
 * y, al scrollear, se va de pantalla como cualquier otro contenido
 * (sin pin, sin scrub, sin fade). Por eso ya no hace falta la
 * estructura de dos capas para el pin-spacer que tenían las
 * versiones anteriores — es un simple `h-screen` centrado.
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
 * loop lento e independiente del scroll.
 *
 * El brillo al hover (borde de las letras iluminándose más blanco) es
 * CSS puro — mismo criterio que el resto de los hover del sitio
 * (ContactSection, Header, ServicesSection): un hover simple y
 * determinístico no necesita GSAP. Dos `drop-shadow` apilados (uno
 * ajustado, uno más difuso) en vez de uno solo, para que el brillo
 * tenga un núcleo definido y un halo suave alrededor — se nota más
 * "con intención" que un blur plano. `drop-shadow` (no `box-shadow`)
 * porque sigue la silueta real de las letras, no un rectángulo.
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

    // Entrada: autoplay al montar, NO atada al scroll. Un leve delay
    // para que no "explote" apenas termina de pintar la página — deja
    // que el layout respire un instante antes de arrancar. Posiciones
    // con labels absolutos (no `.to()` encadenados) por el mismo
    // motivo de siempre (ver nota extensa en MacbookOpenReveal.jsx: el
    // orden de inserción de GSAP no garantiza el orden en el tiempo).
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
  });

  return (
    <section
      ref={scope}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-fein-dark"
    >
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

      <div className="relative flex flex-col items-center gap-6">
        <h1
          aria-label="Fein"
          className="flex select-none text-[26vw] font-semibold leading-none tracking-tight text-white transition-[filter] duration-500 ease-out [filter:drop-shadow(0_0_0px_rgba(255,255,255,0))_drop-shadow(0_0_0px_rgba(255,255,255,0))] hover:[filter:drop-shadow(0_0_18px_rgba(255,255,255,0.9))_drop-shadow(0_0_46px_rgba(255,255,255,0.45))] md:text-[18vw]"
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
    </section>
  );
}
