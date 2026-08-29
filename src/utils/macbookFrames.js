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
 * Extraído de MacbookSequenceSection.jsx a este módulo compartido
 * porque PageLoader.jsx también necesita la misma lista (para
 * precargarla detrás de la pantalla de carga, antes de que
 * MacbookSequenceSection llegue a montarse) — una sola fuente de
 * verdad en vez de dos glob por separado.
 * ============================================================ */
const frameModules = import.meta.glob('../assets/frames/macbook/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

export const macbookFrames = Object.keys(frameModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => frameModules[key]);

export default macbookFrames;
