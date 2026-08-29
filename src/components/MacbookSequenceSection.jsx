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
        // 866 frames ahora (antes 300, un solo clip) — son 3 clips de
        // 10s concatenados (apertura + estampas + cierre, ver el
        // comentario de cabecera de utils/macbookFrames.js, incluye
        // por qué el tramo de estampas quedó en 266 y no 300). Subido
        // a 12 (de 4) para mantener aproximadamente la MISMA relación
        // frames-por-scroll que ya existía (300f/4vh = 75f/vh →
        // 866f/12vh ≈ 72f/vh) en vez de que la secuencia se sienta
        // mucho más rápida/brusca por tener casi el triple de frames
        // en el mismo tramo de scroll.
        scrollLength={12}
        className="bg-fein-light"
        ariaLabel="Una laptop con el sticker de StudiosFein se abre, muestra una remera blanca que va cambiando de estampas propias, y se cierra sobre ese mismo sticker."
      />
    );
  }

  if (macbookVideoSrc) {
    return <MacbookVideoScrub videoSrc={macbookVideoSrc} />;
  }

  return <MacbookOpenReveal />;
}
