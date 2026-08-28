import ImageSequenceViewer from './ImageSequenceViewer';

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
    // Placeholder de desarrollo: se muestra solo mientras no haya
    // frames reales en la carpeta de arriba. Se puede borrar este
    // bloque `if` una vez que los assets estén puestos.
    return (
      <section className="flex h-screen w-full items-center justify-center bg-neutral-950 px-6 text-center">
        <p className="max-w-md text-sm leading-relaxed text-neutral-500">
          Faltan los frames de la Macbook. Colocalos en{' '}
          <code className="text-neutral-300">src/assets/frames/macbook/</code> con el
          formato <code className="text-neutral-300">frame_0001.webp</code>,{' '}
          <code className="text-neutral-300">frame_0002.webp</code>, etc.
        </p>
      </section>
    );
  }

  return <ImageSequenceViewer frameUrls={macbookFrames} scrollLength={4} className="bg-neutral-950" />;
}
