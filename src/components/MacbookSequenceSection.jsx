import ImageSequenceViewer from './ImageSequenceViewer';
import MacbookOpenReveal from './MacbookOpenReveal';

/* ============================================================
 *  ASSETS — Secuencia de la Macbook
 * ============================================================
 *  Colocá acá los frames renderizados (Macbook con stickers de
 *  Fein → se abre → muestra una remera blanca que va cambiando
 *  de estampas):
 *
 *      src/assets/frames/macbook/
 *
 *  Nombralos con padding numérico para que ordenen bien:
 *      frame_0001.webp, frame_0002.webp, ... frame_0180.webp
 *
 *  Se importan y ordenan automáticamente acá abajo (import.meta.glob):
 *  no hace falta tocar este archivo al agregar o sacar frames.
 *
 *  Formato recomendado: .webp (más liviano), mismo aspect ratio
 *  para todos los frames. Cuantos más frames, más "fluida" se ve
 *  la secuencia, pero también más peso a precargar — 100-200
 *  frames en .webp comprimido suele ser un buen balance.
 * ============================================================ */
const frameModules = import.meta.glob('../assets/frames/macbook/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

const macbookFrames = Object.keys(frameModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => frameModules[key]);

/**
 * 2. SECUENCIA MACBOOK
 * --------------------
 * Wrapper delgado sobre <ImageSequenceViewer> (ver
 * src/components/ImageSequenceViewer.jsx para la lógica de canvas
 * + preload + pin/scrub). `scrollLength={4}` = la secuencia completa
 * dura 4 alturas de viewport de scroll una vez pineada.
 */
export default function MacbookSequenceSection() {
  if (!macbookFrames.length) {
    // Fallback de diseño: mientras no haya frames reales en la carpeta
    // de arriba, se muestra la versión ilustrada (CSS/SVG + GSAP) —
    // ver MacbookOpenReveal.jsx. Apenas se agreguen frames reales acá,
    // este fallback deja de usarse solo, no hace falta tocar nada.
    return <MacbookOpenReveal />;
  }

  return <ImageSequenceViewer frameUrls={macbookFrames} scrollLength={4} className="bg-fein-dark" />;
}
