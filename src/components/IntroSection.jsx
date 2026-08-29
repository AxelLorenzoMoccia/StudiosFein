import { useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';

// "StudiosFein" — el wordmark real de la marca (ver el sticker central
// del mockup de Macbook que compartió el cliente). El resto del sitio
// sigue diciendo "Fein" a secas (decisión explícita: solo este logo
// grande cambia, no todo el copy) — acá es el único lugar del sitio
// con el nombre completo de marca.
const LETTERS = ['S', 't', 'u', 'd', 'i', 'o', 's', 'F', 'e', 'i', 'n'];

/**
 * 1. INTRO — "hacer foco", claro por default, oscuro conserva el "hilo"
 * =========================================================================
 * El wordmark entra desenfocado, letra por letra, y hace foco con
 * precisión — como si algo impreciso se resolviera en algo exacto.
 * Debajo se traza una línea (el acento de marca) y recién ahí aparece
 * la tagline, en ese orden, sin apuro.
 *
 * El logo NO se desvanece al scrollear (a pedido explícito) — es una
 * sección normal, sin pin ni scroll-scrub: aparece una vez al cargar
 * y, al scrollear, se va de pantalla como cualquier otro contenido.
 *
 * Accesibilidad: partir "StudiosFein" en spans (para el stagger letra
 * por letra) rompe cómo lo lee un screen reader si no se corrige — por
 * eso el `aria-label="StudiosFein"` vive en el <h1> base y cada letra
 * individual es `aria-hidden`. El ® no entra en el label (no se lee en
 * voz alta, es una convención tipográfica). El segundo <h1> (la capa
 * de brillo) es enteramente `aria-hidden` — es una copia decorativa.
 *
 * DOS TEMAS, MISMA MECÁNICA — el sitio pasó a ser claro por default
 * (pedido explícito del cliente), con oscuro como toggle que conserva
 * el look original. En vez de dos componentes separados, es el MISMO
 * efecto de "borde que se ilumina cerca del mouse" con los colores
 * cambiados vía `dark:`:
 *   - Claro (default): letras rellenas en negro suave, sin contorno.
 *     El brillo al pasar el mouse es un trazo dorado (`accent`) con
 *     glow cálido — un detalle de marca, no un efecto "neón".
 *   - Oscuro: exactamente el mismo tratamiento de "hilo" que ya existía
 *     (contorno blanco tenue en reposo + brillo blanco intenso
 *     siguiendo al cursor) — el modo oscuro conserva el sitio tal cual
 *     estaba, no es una versión nueva.
 * Se arma con dos capas de texto idénticas superpuestas — y el ORDEN
 * importa, no es decorativo:
 *   1. Capa base: la de ARRIBA en el stacking (`relative z-10`),
 *      relleno sólido "de reposo" (negro en claro, casi blanco con
 *      contorno en oscuro).
 *   2. Capa de brillo: la de ABAJO (`absolute`, sin z-index propio —
 *      en CSS, un elemento `position: absolute` siempre se pinta
 *      arriba de uno `static`, así que si esta capa quedaba SIN
 *      `z-index` mientras la base tampoco tenía uno, la de brillo
 *      terminaba ganando igual y pintándose ENCIMA de las letras, no
 *      atrás — de ahí que el borde se viera "por arriba" en vez de
 *      alrededor). Mismo texto que la base, con relleno sólido propio
 *      (no transparente) y un trazo (`-webkit-text-stroke`) más ancho
 *      que el de la base, recortado con una `mask-image`
 *      radial-gradient centrada en la posición del mouse. Al quedar
 *      DETRÁS de la base, el relleno opaco de la base tapa la mitad
 *      interior del trazo (el trazo de un texto siempre queda
 *      centrado sobre el borde de la letra, mitad adentro/mitad
 *      afuera) — solo asoma la mitad exterior, como un halo ceñido a
 *      la silueta real en vez de una línea que corta la letra al
 *      medio. El relleno sólido en la capa de brillo (antes
 *      transparente) es el mismo arreglo que ya se hizo en la capa
 *      base para las letras con curvas que se cruzan ("e", "n"): sin
 *      relleno detrás, el trazo se corta en esos puntos.
 *
 * Se actualizan las variables directo sobre el DOM (`style.setProperty`)
 * en vez de por estado de React — un `pointermove` dispara decenas de
 * veces por segundo y no tiene sentido re-renderizar el componente por
 * cada uno. Además se agrupan con `requestAnimationFrame`: escribir la
 * posición en cada evento crudo (sin agrupar) sobre un elemento tan
 * grande con `filter`/`mask-image` (caros de recalcular) se sentía
 * trabado — como mucho se actualiza una vez por frame, no una vez por
 * evento. No es una animación de GSAP en sí (es tracking de mouse
 * 1:1), así que van con listeners nativos — pero sí viven dentro del
 * callback de `useGSAP` para reusar su cleanup automático al
 * desmontar (ver el JSDoc de ese hook).
 */
export default function IntroSection() {
  const wordmarkRef = useRef(null);
  const glowRef = useRef(null);

  const scope = useGSAP((gsap) => {
    gsap.set('[data-intro-letter]', { opacity: 0, filter: 'blur(20px)', y: 12 });
    gsap.set('[data-intro-line]', { scaleX: 0 });
    gsap.set('[data-intro-tagline]', { opacity: 0, y: 10 });
    // El brillo arranca invisible: no tiene sentido que se vea
    // "prendido" antes de que las letras terminen de enfocar.
    gsap.set(glowRef.current, { opacity: 0 });

    // No hace falta guardar la referencia ni matarlas manualmente: al
    // vivir dentro del gsap.context() de useGSAP, `ctx.revert()` las
    // limpia solas al desmontar.
    //
    // `prefers-reduced-motion`: estos dos glows son puro ambiente (no
    // comunican nada, a diferencia del reveal de las letras) y se
    // mueven en loop infinito sobre gran parte de la pantalla — el
    // caso de manual de "parallax" que DESIGN.md §4.5 pide reducir o
    // sacar, no solo bajarle la velocidad (a diferencia del marquee de
    // TrustedByMarquee.jsx, un glow quieto no "se lee como roto": es
    // indistinguible de un fondo estático a propósito). Auditoría
    // pendiente que quedaba marcada en DESIGN.md §6.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
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
    }

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
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'feinOut', stagger: 0.04 },
        'resolve'
      )
      // La línea se traza mientras las últimas letras todavía están
      // asentando — se solapan un poco para que no se sienta como una
      // lista de pasos separados, sino una sola secuencia continua.
      .to('[data-intro-line]', { scaleX: 1, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.55')
      .to('[data-intro-tagline]', { opacity: 1, y: 0, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.75')
      // El brillo queda "habilitado" (listo para reaccionar al mouse)
      // al mismo tiempo que aparece la tagline — cierra la secuencia.
      .to(glowRef.current, { opacity: 1, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.75');

    // Tramo cercano al mouse: mueve el centro de la máscara radial de
    // la capa de brillo a la posición del cursor, relativa al propio
    // wordmark (no a la ventana).
    const wordmark = wordmarkRef.current;
    const glow = glowRef.current;

    // Agrupado por rAF: `pointermove` puede disparar muchas más veces
    // por segundo de las que la pantalla refresca — sin agrupar,
    // cada evento crudo reescribía la posición y forzaba recalcular
    // el `mask-image` sobre un texto enorme con `filter` encima, y se
    // sentía trabado. Con esto, como mucho se escribe una vez por
    // frame; los eventos de más entre frames solo actualizan
    // `pendingClientX/Y`, no tocan el DOM.
    let rafId = null;
    let pendingClientX = 0;
    let pendingClientY = 0;

    const applyGlowPosition = () => {
      rafId = null;
      const rect = wordmark.getBoundingClientRect();
      glow.style.setProperty('--mx', `${pendingClientX - rect.left}px`);
      glow.style.setProperty('--my', `${pendingClientY - rect.top}px`);
    };

    const handlePointerMove = (event) => {
      pendingClientX = event.clientX;
      pendingClientY = event.clientY;
      if (rafId === null) rafId = requestAnimationFrame(applyGlowPosition);
    };

    // Al salir, el centro se manda bien lejos — la máscara radial deja
    // de cubrir cualquier parte del wordmark y el brillo desaparece.
    const handlePointerLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      glow.style.setProperty('--mx', '-9999px');
      glow.style.setProperty('--my', '-9999px');
    };

    wordmark.addEventListener('pointermove', handlePointerMove);
    wordmark.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      wordmark.removeEventListener('pointermove', handlePointerMove);
      wordmark.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });

  return (
    <section
      ref={scope}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-fein-light"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          data-intro-glow-a
          className="absolute left-[8%] top-[12%] h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-[120px] dark:opacity-50"
          style={{ background: 'radial-gradient(circle, #d4b876 0%, transparent 70%)' }}
        />
        <div
          data-intro-glow-b
          className="absolute bottom-[8%] right-[8%] h-[50vmax] w-[50vmax] rounded-full opacity-20 blur-[120px] dark:opacity-40"
          style={{ background: 'radial-gradient(circle, #b08b4f 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Wordmark: dos <h1> idénticos superpuestos — ver nota grande
            arriba. `ref={wordmarkRef}` es el área que escucha el
            mouse; su bounding box es exactamente la de las letras, así
            que el efecto solo reacciona sobre ellas.

            OJO: la capa de brillo usa `inset-y-0 left-4 right-4`, NO
            `inset-0` — este wrapper tiene `px-4`, y un hijo con
            `position: absolute` ignora el padding del padre para su
            propio posicionamiento (su "containing block" es la
            padding-box completa, sin el padding descontado). Con
            `inset-0` la capa de brillo quedaba corrida 16px a la
            izquierda de las letras reales (confirmado con
            getBoundingClientRect: `glow.left - base.left === -16`) —
            el borde se iluminaba al lado de cada letra, no encima.
            `left-4`/`right-4` replican el mismo `px-4` a mano para que
            las dos capas ocupen exactamente la misma caja. */}
        <div ref={wordmarkRef} className="relative px-4">
          <h1
            aria-label="StudiosFein"
            className="relative z-10 flex select-none items-start text-[10vw] font-black leading-none tracking-tight text-neutral-900 [-webkit-text-fill-color:rgb(23,23,23)] dark:text-white/90 dark:[-webkit-text-fill-color:rgba(255,255,255,0.92)] dark:[-webkit-text-stroke:2px_rgba(255,255,255,0.55)] md:text-[5.5vw]"
          >
            {LETTERS.map((letter, i) => (
              <span key={i} data-intro-letter aria-hidden="true" className="inline-block">
                {letter}
              </span>
            ))}
            <span
              aria-hidden="true"
              className="ml-1 mt-1 select-none text-[2.2vw] font-semibold md:text-[1.1vw]"
            >
              ®
            </span>
          </h1>

          {/* Capa de brillo — copia exacta, puramente decorativa,
              recortada por la máscara radial que sigue al mouse.
              DETRÁS de la base (sin z-index propio, ver nota grande de
              arriba) y con relleno sólido IGUAL al de la base — así el
              relleno opaco de la base (que va arriba) tapa la mitad
              interior del trazo, y solo asoma la mitad exterior como
              un halo ceñido a la silueta real. */}
          <h1
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-4 right-4 flex select-none items-start text-[10vw] font-black leading-none tracking-tight text-neutral-900 [-webkit-text-fill-color:rgb(23,23,23)] [-webkit-text-stroke:4px_rgba(176,139,79,1)] [filter:drop-shadow(0_0_3px_rgba(212,184,118,0.9))] dark:text-white/90 dark:[-webkit-text-fill-color:rgba(255,255,255,0.92)] dark:[-webkit-text-stroke:4px_rgba(255,255,255,1)] dark:[filter:drop-shadow(0_0_3px_rgba(255,255,255,0.9))] md:text-[5.5vw]"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle 140px at var(--mx, -9999px) var(--my, -9999px), black 0%, black 40%, transparent 75%)',
              maskImage:
                'radial-gradient(circle 140px at var(--mx, -9999px) var(--my, -9999px), black 0%, black 40%, transparent 75%)',
            }}
          >
            {LETTERS.map((letter, i) => (
              <span key={i} className="inline-block">
                {letter}
              </span>
            ))}
            <span aria-hidden="true" className="ml-1 mt-1 select-none text-[2.2vw] font-semibold md:text-[1.1vw]">
              ®
            </span>
          </h1>
        </div>

        <span
          data-intro-line
          aria-hidden="true"
          className="h-px w-24 bg-accent sm:w-32"
          style={{ transformOrigin: 'center' }}
        />

        <p
          data-intro-tagline
          className="select-none text-xs font-medium uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400 sm:text-sm"
        >
          Estudio de diseño e identidad de marca
        </p>
      </div>
    </section>
  );
}
