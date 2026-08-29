import { useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';

const LETTERS = ['F', 'e', 'i', 'n'];

/**
 * 1. INTRO — "hacer foco", sin salida, wordmark de "hilo"
 * ==========================================================
 * El wordmark entra desenfocado, letra por letra, y hace foco con
 * precisión — como si algo impreciso se resolviera en algo exacto.
 * Debajo se traza una línea (el acento de marca) y recién ahí aparece
 * la tagline, en ese orden, sin apuro.
 *
 * El logo NO se desvanece al scrollear (a pedido explícito) — es una
 * sección normal, sin pin ni scroll-scrub: aparece una vez al cargar
 * y, al scrollear, se va de pantalla como cualquier otro contenido.
 *
 * Accesibilidad: partir "Fein" en 4 <span> (para el stagger letra por
 * letra) rompe cómo lo lee un screen reader si no se corrige — por
 * eso el `aria-label="Fein"` vive en el <h1> base y cada letra
 * individual es `aria-hidden`. El segundo <h1> (la capa de brillo) es
 * enteramente `aria-hidden` — es una copia puramente decorativa.
 *
 * Fondo con atmósfera de color: nada de negro plano — dos glows
 * grandes, muy desenfocados, en dos tonos del MISMO dorado de marca
 * (`accent`/`accent-light`), a la deriva con un loop lento e
 * independiente del scroll.
 *
 * EFECTO "HILO" que se ilumina cerca del mouse
 * ----------------------------------------------
 * No es un glow parejo a todo el logo al hacer hover — es un borde
 * que rodea cada letra, y SOLO el tramo de ese borde cercano al
 * cursor se ilumina de blanco más intenso, siguiendo al mouse en
 * tiempo real (el efecto tipo "neón" que se ve en librerías de
 * componentes como 21st.dev). Se arma con dos capas de texto
 * idénticas superpuestas:
 *
 *   1. Capa base: letras con relleno casi blanco (no transparente —
 *      la primera versión de esto dejaba el relleno 100% transparente
 *      para que se vieran solo como contorno/"hilo", pero
 *      `-webkit-text-stroke` sobre un relleno vacío renderiza mal en
 *      letras con contornos que se auto-intersecan, como la "e" (la
 *      panza) y la "n" (donde el asta se une al arco) — quedaban con
 *      un corte/hueco visible que no era intencional. Con relleno de
 *      verdad esas costuras quedan tapadas y la letra se ve completa)
 *      + un trazo (`-webkit-text-stroke`) tenue encima, que sigue
 *      dando el borde definido.
 *   2. Capa de brillo: mismas letras, mismo trazo pero blanco puro +
 *      `drop-shadow` (el "borde encendido"), recortada con una
 *      `mask-image` radial-gradient centrada en la posición del mouse
 *      (variables CSS `--mx`/`--my` en píxeles, actualizadas a mano
 *      en cada `pointermove` sobre el wordmark). Fuera de ese círculo,
 *      la máscara es transparente — por eso solo se ve encendido el
 *      tramo cercano al cursor, no la letra entera. Esta capa sigue
 *      con relleno transparente a propósito: donde la máscara no
 *      cubre, se ve la capa base (ya rellena) por debajo.
 *
 * Se actualizan las variables directo sobre el DOM (`style.setProperty`)
 * en vez de por estado de React — un `pointermove` dispara decenas de
 * veces por segundo y no tiene sentido re-renderizar el componente por
 * cada uno (mismo criterio que usa el resto del sitio para todo lo que
 * GSAP anima vía selector, sin pasar por React state). No es una
 * animación de GSAP en sí (es tracking de mouse 1:1, no algo que deba
 * interpolarse con un ease), así que van con listeners nativos — pero
 * sí viven dentro del callback de `useGSAP` para reusar su cleanup
 * automático al desmontar (ver el JSDoc de ese hook).
 */
export default function IntroSection() {
  const wordmarkRef = useRef(null);
  const glowRef = useRef(null);

  const scope = useGSAP((gsap) => {
    gsap.set('[data-intro-letter]', { opacity: 0, filter: 'blur(20px)', y: 12 });
    gsap.set('[data-intro-line]', { scaleX: 0 });
    gsap.set('[data-intro-tagline]', { opacity: 0, y: 10 });
    // El hilo encendido arranca invisible: no tiene sentido que se vea
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
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'feinOut', stagger: 0.05 },
        'resolve'
      )
      // La línea se traza mientras la última letra todavía está
      // asentando — se solapan un poco para que no se sienta como una
      // lista de pasos separados, sino una sola secuencia continua.
      .to('[data-intro-line]', { scaleX: 1, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.5')
      .to('[data-intro-tagline]', { opacity: 1, y: 0, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.7')
      // El hilo queda "habilitado" (listo para reaccionar al mouse) al
      // mismo tiempo que aparece la tagline — cierra la secuencia.
      .to(glowRef.current, { opacity: 1, duration: 0.6, ease: 'feinOut' }, 'resolve+=0.7');

    // Tramo del hilo cercano al mouse: mueve el centro de la máscara
    // radial de la capa de brillo a la posición del cursor, relativa
    // al propio wordmark (no a la ventana).
    const wordmark = wordmarkRef.current;
    const glow = glowRef.current;

    const setGlowPosition = (clientX, clientY) => {
      const rect = wordmark.getBoundingClientRect();
      glow.style.setProperty('--mx', `${clientX - rect.left}px`);
      glow.style.setProperty('--my', `${clientY - rect.top}px`);
    };

    const handlePointerMove = (event) => setGlowPosition(event.clientX, event.clientY);
    // Al salir, el centro se manda bien lejos — la máscara radial deja
    // de cubrir cualquier parte del hilo y el brillo desaparece.
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
        {/* Wordmark de "hilo": dos <h1> idénticos superpuestos — ver
            nota grande arriba. `ref={wordmarkRef}` es el área que
            escucha el mouse; su bounding box es exactamente la de las
            letras, así que el efecto solo reacciona sobre ellas. */}
        <div ref={wordmarkRef} className="relative">
          <h1
            aria-label="Fein"
            className="flex select-none text-[28vw] font-semibold leading-none tracking-tight text-white/90 [-webkit-text-fill-color:rgba(255,255,255,0.92)] [-webkit-text-stroke:2px_rgba(255,255,255,0.55)] md:text-[19vw]"
          >
            {LETTERS.map((letter, i) => (
              <span key={i} data-intro-letter aria-hidden="true" className="inline-block">
                {letter}
              </span>
            ))}
          </h1>

          {/* Capa de brillo — copia exacta, puramente decorativa,
              recortada por la máscara radial que sigue al mouse. */}
          <h1
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex select-none text-[28vw] font-semibold leading-none tracking-tight text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:2.5px_rgba(255,255,255,1)] [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.9))] md:text-[19vw]"
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
          className="select-none text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 sm:text-sm"
        >
          Estudio de diseño e identidad de marca
        </p>
      </div>
    </section>
  );
}
