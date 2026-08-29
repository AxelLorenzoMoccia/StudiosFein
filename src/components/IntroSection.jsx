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
 * Se arma con dos capas de texto idénticas superpuestas:
 *   1. Capa base: el relleno "de reposo" (negro en claro, casi blanco
 *      con contorno en oscuro).
 *   2. Capa de brillo: mismo texto, recortado con una `mask-image`
 *      radial-gradient centrada en la posición del mouse (variables
 *      CSS `--mx`/`--my` en píxeles, actualizadas a mano en cada
 *      `pointermove`). Fuera de ese círculo la máscara es transparente
 *      — solo se ve encendido el tramo cercano al cursor. El trazo es
 *      fino (2px) y el `drop-shadow` casi sin blur (3px) a propósito:
 *      antes tenía mucho blur (12-14px) y quedaba un halo difuso que
 *      no calzaba con la letra — así el borde queda ceñido a la forma
 *      real de cada letra, no una mancha de luz alrededor.
 *
 * Se actualizan las variables directo sobre el DOM (`style.setProperty`)
 * en vez de por estado de React — un `pointermove` dispara decenas de
 * veces por segundo y no tiene sentido re-renderizar el componente por
 * cada uno. No es una animación de GSAP en sí (es tracking de mouse
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

    const setGlowPosition = (clientX, clientY) => {
      const rect = wordmark.getBoundingClientRect();
      glow.style.setProperty('--mx', `${clientX - rect.left}px`);
      glow.style.setProperty('--my', `${clientY - rect.top}px`);
    };

    const handlePointerMove = (event) => setGlowPosition(event.clientX, event.clientY);
    // Al salir, el centro se manda bien lejos — la máscara radial deja
    // de cubrir cualquier parte del wordmark y el brillo desaparece.
    const handlePointerLeave = () => {
      glow.style.setProperty('--mx', '-9999px');
      glow.style.setProperty('--my', '-9999px');
    };

    wordmark.addEventListener('pointermove', handlePointerMove);
    wordmark.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      wordmark.removeEventListener('pointermove', handlePointerMove);
      wordmark.removeEventListener('pointerleave', handlePointerLeave);
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
            que el efecto solo reacciona sobre ellas. */}
        <div ref={wordmarkRef} className="relative px-4">
          <h1
            aria-label="StudiosFein"
            className="flex select-none items-start text-[10vw] font-black leading-none tracking-tight text-neutral-900 [-webkit-text-fill-color:rgb(23,23,23)] dark:text-white/90 dark:[-webkit-text-fill-color:rgba(255,255,255,0.92)] dark:[-webkit-text-stroke:2px_rgba(255,255,255,0.55)] md:text-[5.5vw]"
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
              recortada por la máscara radial que sigue al mouse. */}
          <h1
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex select-none items-start text-[10vw] font-black leading-none tracking-tight text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:2px_rgba(176,139,79,1)] [filter:drop-shadow(0_0_3px_rgba(212,184,118,0.9))] dark:[-webkit-text-stroke:2px_rgba(255,255,255,1)] dark:[filter:drop-shadow(0_0_3px_rgba(255,255,255,0.9))] md:text-[5.5vw]"
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
