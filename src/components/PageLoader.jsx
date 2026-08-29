import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { macbookFrames } from '../utils/macbookFrames';
import { loadImage } from '../utils/loadImage';

// Tope duro de espera — si la conexión es lenta, el sitio no se puede
// quedar bloqueado esperando ~300 frames (regla ALTA de DESIGN.md §6:
// performance). Pasado este tiempo, el loader se cierra igual aunque
// no haya terminado de precargar todo; `ImageSequenceViewer.jsx` ya
// tiene su propio fallback de "Cargando secuencia… X%" para el resto
// si el usuario llega a esa sección antes de que termine.
const MAX_WAIT_MS = 2500;

// Piso de tiempo visible — si todo carga instantáneo (caché tibia),
// igual se sostiene un mínimo para que el trazo del wordmark se
// alcance a ver una vez completo, no un parpadeo de un frame.
const MIN_DISPLAY_MS = 900;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * PANTALLA DE CARGA — el wordmark "se traza" como una firma
 * -------------------------------------------------------------
 * Tapa la precarga de los ~300 frames de la secuencia Macbook (el
 * asset más pesado del sitio, ver utils/macbookFrames.js) con un
 * primer momento de marca en vez de una pantalla en blanco — el
 * "elemento memorable" de esta pieza (DESIGN.md §1.7) es que el
 * mismo wordmark que ya vive en IntroSection.jsx ("StudiosFein", el
 * logo real de marca) se dibuja de izquierda a derecha antes de
 * mostrar nada más, como una firma — coherente con lo primero que va
 * a ver después, en vez de mostrar acá otra cosa.
 *
 * Claro por default / oscuro conserva el look original: mismo
 * criterio de `dark:` que el resto del sitio, ver la nota grande de
 * IntroSection.jsx sobre los dos temas.
 *
 * Progreso REAL, no decorativo: el barrido de `clip-path` está atado
 * directamente al `loadProgress` (frames ya decodificados / total),
 * no a un timer fijo — si la conexión es lenta se ve reflejado, si es
 * rápida el trazo se completa rápido.
 *
 * Carrera contra un tope duro (`MAX_WAIT_MS`): esperar a que
 * TERMINEN de precargar los ~300 frames podría demorar mucho en una
 * conexión mala, y no vale la pena bloquear todo el sitio por eso —
 * pasado el tope, se revela la página igual (el resto de la precarga
 * sigue en background, `ImageSequenceViewer` la retoma sola si hace
 * falta cuando el usuario llegue a esa sección).
 *
 * `prefers-reduced-motion`: se salta el trazo con clip-path y el
 * scale de salida — solo fade de opacity (regla DESIGN.md §4.5: no
 * sacar el feedback de carga entero, sólo el movimiento).
 *
 * Los frames que este loader precarga (`loadImage`, mismo util que
 * usa ImageSequenceViewer.jsx) quedan en caché del navegador — cuando
 * ImageSequenceViewer los vuelve a pedir más abajo en la página, los
 * recibe al instante, no hay doble espera para el usuario.
 *
 * Nota: es el único componente del sitio que importa `gsap` directo
 * en vez de pasar por `useGSAP()` — a propósito. Ese hook existe para
 * scopear selectores (`gsap.context`) y limpiar ScrollTriggers al
 * desmontar; acá no hay scroll de por medio, el tween de salida es
 * único (se dispara una vez, sobre un ref concreto, no un selector) y
 * el componente se desmonta solo apenas termina — no hay nada que
 * ese hook aportaría acá.
 */
export default function PageLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  // Valor plano, no un ref: no cambia durante la vida del componente,
  // así que no hace falta la semántica de ref — y leer `.current` de
  // un ref durante el render está prohibido (regla de React 19, no
  // solo estilo: "Cannot access refs during render").
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let cancelled = false;
    const total = macbookFrames.length;
    let loaded = 0;

    const preload =
      total === 0
        ? Promise.resolve()
        : Promise.all(
            macbookFrames.map((src) =>
              loadImage(src).then(() => {
                loaded += 1;
                if (!cancelled) setProgress(loaded / total);
              })
            )
          );

    Promise.all([Promise.race([preload, wait(MAX_WAIT_MS)]), wait(MIN_DISPLAY_MS)]).then(() => {
      if (cancelled) return;
      if (!prefersReducedMotion) setProgress(1);

      gsap.to(containerRef.current, {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.03,
        duration: prefersReducedMotion ? 0.3 : 0.5,
        ease: 'feinOut',
        onComplete: onDone,
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sweepStyle = prefersReducedMotion
    ? undefined
    : { clipPath: `inset(0% ${(1 - progress) * 100}% 0% 0%)` };

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-fein-light"
    >
      <span className="sr-only">Cargando StudiosFein, {Math.round(progress * 100)}%</span>

      <div className="relative" aria-hidden="true">
        {/* Trazo tenue de fondo — sin esto, la letra "aparece" pero no
            se lee como si algo la estuviera dibujando: siempre visible
            para dar la referencia completa de la forma. */}
        <h1 className="select-none text-[8vw] font-black leading-none tracking-tight text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_rgba(23,23,23,0.18)] dark:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.18)] md:text-[3.6vw]">
          StudiosFein
        </h1>
        {/* Trazo real, recortado por el barrido de clip-path */}
        <h1
          className="absolute inset-0 select-none text-[8vw] font-black leading-none tracking-tight text-neutral-900 [-webkit-text-fill-color:rgb(23,23,23)] transition-[clip-path] duration-300 ease-out dark:text-white/90 dark:[-webkit-text-fill-color:rgba(255,255,255,0.92)] dark:[-webkit-text-stroke:2px_rgba(255,255,255,0.55)] md:text-[3.6vw]"
          style={sweepStyle}
        >
          StudiosFein
        </h1>
      </div>

      <span
        aria-hidden="true"
        className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-500"
      >
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}
