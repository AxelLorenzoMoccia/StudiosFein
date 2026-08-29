/* ============================================================
 *  ASSETS — Secuencia de la Macbook
 * ============================================================
 *  Colocá acá los frames renderizados. Hoy son 866 (frame_0001 a
 *  frame_0866), tres clips de 10s del cliente concatenados en un
 *  solo tramo continuo de scroll:
 *
 *      0001-0300  apertura (laptop cerrada con el sticker
 *                 StudiosFein → se abre)
 *      0301-0566  la remera en blanco cambiando de estampas
 *                 propias (Tussy Club, Tssyclub, Jussy, etc.)
 *      0567-0866  cierre (misma laptop, se cierra sobre el sticker)
 *
 *  El tramo de estampas quedó en 266 frames, no 300 — se sacaron 34
 *  frames (los que originalmente iban del 211 al 244 dentro de ese
 *  clip) porque esa estampa puntual ("Tussy Club · World Tribe")
 *  traía metidos el logo real de Coca-Cola y el de la gorra de los
 *  Yankees de Nueva York — no algo genérico inventado por la IA, dos
 *  marcas de terceros reconocibles. Se cortó ese tramo y se
 *  renumeraron los frames siguientes para que la secuencia quede
 *  continua (empalme verificado a mano, frame a frame, sin salto
 *  visible). El resto de las estampas de esta tanda SÍ se revisaron y
 *  están limpias.
 *
 *      src/assets/frames/macbook/
 *
 *  Nombralos con padding numérico para que ordenen bien:
 *      frame_0001.webp, frame_0002.webp, ... frame_0866.webp
 *
 *  Se importan y ordenan automáticamente acá abajo (import.meta.glob):
 *  no hace falta tocar este archivo al agregar o sacar frames — pero
 *  si el número total cambia, revisar `scrollLength` en
 *  MacbookSequenceSection.jsx (está pensado para mantener la relación
 *  frames-por-scroll, no un valor fijo).
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

// Subsampleo para mobile — 1 de cada 3 frames (≈289 de 866).
//
// Los 866 frames de arriba son fotos reales (no ilustraciones), y
// pesan ~15MB en total — mucho más que el set anterior de 300 frames
// dibujados (~3.5MB). En una conexión de celular esa descarga es lo
// que hace que la sección tarde "bastante" en aparecer: el tope duro
// de PageLoader.jsx (2.5s) no alcanza a cubrirla, así que el usuario
// termina esperando en el fallback propio de ImageSequenceViewer.
//
// Se define acá (no en cada componente que lo usa) porque tanto
// MacbookSequenceSection.jsx como PageLoader.jsx necesitan el MISMO
// subset — si cada uno recortara por su cuenta, PageLoader podría
// precargar frames que ImageSequenceViewer nunca pide (o viceversa),
// desperdiciando el ancho de banda que este subsampleo busca ahorrar.
// El desktop sigue usando `macbookFrames` completo (la versión más
// fluida) sin tocar nada acá.
const MOBILE_FRAME_STEP = 3;

export const macbookFramesMobile = macbookFrames.filter(
  (_, index) => index % MOBILE_FRAME_STEP === 0
);

export default macbookFrames;
