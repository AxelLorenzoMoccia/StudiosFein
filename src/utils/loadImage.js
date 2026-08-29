/**
 * Carga una imagen y resuelve cuando ya está *decodificada* (no solo
 * descargada). `img.decode()` evita el "hitch" de decodificación que
 * ocurre en el primer draw de una imagen recién cargada — clave para
 * que scrollear rápido no trabe el dibujo frame a frame.
 *
 * Si `decode()` no existe (navegador viejo) o falla (ej. frame roto),
 * igual resolvemos con onload/onerror para no bloquear toda la secuencia
 * por un único frame.
 *
 * Extraído de ImageSequenceViewer.jsx a un util compartido porque ahora
 * PageLoader.jsx también necesita precargar los mismos frames de la
 * Macbook (para tapar esa espera con la pantalla de carga) — una sola
 * fuente de verdad en vez de dos copias de la misma función.
 */
export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const settle = () => resolve(img);

    if ('decode' in img) {
      img.decode().then(settle).catch(settle);
    } else {
      img.onload = settle;
      img.onerror = settle;
    }
  });
}

export default loadImage;
