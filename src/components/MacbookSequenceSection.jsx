import ImageSequenceViewer from './ImageSequenceViewer';
import MacbookVideoScrub from './MacbookVideoScrub';
import MacbookOpenReveal from './MacbookOpenReveal';
import { macbookFrames } from '../utils/macbookFrames';

/* ============================================================
 *  ASSETS — Video de referencia de la Macbook (2do escalón)
 * ============================================================
 *  Un único video (.mp4/.webm) en src/assets/videos/ — se toma el
 *  primero que encuentre (ordenado alfabéticamente). Es un clip de
 *  referencia/placeholder, no está pensado para varios a la vez.
 * ============================================================ */
const videoModules = import.meta.glob('../assets/videos/*.{mp4,webm}', {
  eager: true,
  import: 'default',
});

const videoKeys = Object.keys(videoModules).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const macbookVideoSrc = videoKeys.length ? videoModules[videoKeys[0]] : null;

/**
 * 2. SECUENCIA MACBOOK
 * --------------------
 * Cascada de 3 escalones, de mejor a peor según qué asset haya
 * disponible — no hace falta tocar este archivo al ir agregando
 * material, cada uno se activa solo apenas aparece su carpeta:
 *
 *   1. Fotos/frames reales en src/assets/frames/macbook/
 *      → ImageSequenceViewer (canvas, scrubbing frame a frame, la
 *        opción de mejor calidad — ver ese componente).
 *   2. Si no hay fotos pero SÍ un video en src/assets/videos/
 *      → MacbookVideoScrub (scrubbea el video con el scroll,
 *        currentTime en vez de dibujar frames — más rápido de meter
 *        que una secuencia de fotos, pero puede saltar un poco en
 *        scrolls muy bruscos según cómo esté codificado el video).
 *   3. Si no hay ninguno de los dos
 *      → MacbookOpenReveal (100% ilustrado en CSS/SVG + GSAP, el
 *        fallback de diseño con el que arrancó esta sección).
 */
export default function MacbookSequenceSection() {
  if (macbookFrames.length) {
    return (
      <ImageSequenceViewer
        frameUrls={macbookFrames}
        scrollLength={4}
        className="bg-fein-dark"
        ariaLabel="Una Macbook con stickers de Fein se abre y revela una remera blanca en el aire, que va cambiando de estampas."
      />
    );
  }

  if (macbookVideoSrc) {
    return <MacbookVideoScrub videoSrc={macbookVideoSrc} />;
  }

  return <MacbookOpenReveal />;
}
