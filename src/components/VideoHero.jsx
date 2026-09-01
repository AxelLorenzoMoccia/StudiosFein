import { useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import heroVideo from '../assets/videos/studiosfein-hero.mp4';
import heroPoster from '../assets/videos/studiosfein-hero-poster.jpg';

// Cuántas alturas de viewport (vh) de scroll dura todo el recorrido del
// video una vez pineado — el mismo criterio que ya usaba
// ImageSequenceViewer.jsx para la secuencia de la Macbook (scrollLength
// en vh, no un número fijo de píxeles).
const SCROLL_LENGTH = 3;

/**
 * PORTADA — el video del cliente, mapeado 1:1 al scroll
 * ---------------------------------------------------------
 * Pedido explícito: el video NO se reproduce solo — el usuario lo
 * "scrollea" cuadro a cuadro, como la vieja secuencia de imágenes de
 * la Macbook, pero acá el material fuente ES el video (no hace falta
 * separarlo en 866 frames sueltos — `video.currentTime` cumple el
 * mismo rol que el índice de frame de un canvas).
 *
 * `object-fit: cover` a pantalla completa, sin letterbox — pedido
 * explícito ("que ocupen toda la pantalla, así no se ve el inicio y
 * fin del video contrastando con el fondo"): la versión anterior
 * usaba `contain` con barras blancas a los costados, y esas barras
 * quedaban grisáceas/visibles contra el fondo en ciertos momentos.
 * Con `cover` no hay ningún borde que contraste — el video ocupa
 * 100% del viewport siempre.
 *
 * Reencodeado con keyframes cada 6 frames (`-g 6`, ~0.2s) en vez del
 * GOP largo por defecto — sin esto, cada `video.currentTime =` fuerza
 * al decoder a rebobinar hasta el keyframe más cercano y reconstruir
 * frame a frame desde ahí, lo que se siente entrecortado al scrollear
 * rápido. Con keyframes frecuentes cada seek es casi inmediato.
 *
 * Estructura de dos capas (misma lección de siempre, DESIGN.md §5): el
 * `<section>` de afuera tiene altura automática (sin `overflow-hidden`)
 * para que el `pin-spacer` que inserta GSAP pueda crecer y reservar el
 * scroll real; adentro, `[data-video-pin]` es lo que efectivamente se
 * pinea, con su propia altura fija (`h-screen`).
 */
export default function VideoHero() {
  const videoRef = useRef(null);

  const scope = useGSAP((gsap, ScrollTrigger) => {
    const video = videoRef.current;

    const setFrame = (progress) => {
      if (!video.duration) return;
      video.currentTime = progress * video.duration;
    };

    const trigger = ScrollTrigger.create({
      trigger: '[data-video-pin]',
      start: 'top top',
      end: () => `+=${SCROLL_LENGTH * window.innerHeight}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setFrame(self.progress),
    });

    // Si el metadata (duración) todavía no cargó cuando se crea el
    // trigger, el primer par de `onUpdate` no hacen nada (guard de
    // arriba) — apenas carga, sincronizamos con el progreso actual
    // una vez más para no quedar pegados en el frame 0.
    const handleLoadedMetadata = () => setFrame(trigger.progress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      trigger.kill();
    };
  });

  return (
    <section ref={scope} className="relative w-full bg-ink">
      <div data-video-pin className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={heroVideo}
          poster={heroPoster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
