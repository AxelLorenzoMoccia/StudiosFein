import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '../hooks/useGSAP';

/**
 * Carga una imagen y resuelve cuando ya está *decodificada* (no solo
 * descargada). `img.decode()` evita el "hitch" de decodificación que
 * ocurre en el primer draw de una imagen recién cargada — clave para
 * que scrollear rápido no trabe el dibujo frame a frame.
 *
 * Si `decode()` no existe (navegador viejo) o falla (ej. frame roto),
 * igual resolvemos con onload/onerror para no bloquear toda la secuencia
 * por un único frame.
 */
function loadImage(src) {
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

/**
 * ImageSequenceViewer
 * --------------------
 * Componente "core" para secuencias de imágenes controladas por scroll,
 * al estilo Apple (ej. la rotación de un producto). Dibuja un array de
 * imágenes en un <canvas> a pantalla completa, avanzando el frame según
 * el progreso del scroll, mientras el propio canvas queda pineado
 * (position fija) durante ese tramo.
 *
 * Props:
 * - frameUrls: string[]        → URLs de los frames, en orden. IMPORTANTE:
 *                                 memoizar el array (useMemo) en el padre
 *                                 para no disparar una nueva precarga en
 *                                 cada render.
 * - scrollLength: number       → cuántas alturas de viewport (vh) de
 *                                 scroll dura toda la secuencia una vez
 *                                 pineada. Default: 3 (=300vh).
 * - scrub: boolean | number    → sincronía con el scroll. `true` = 1:1.
 *                                 Un número (ej. 0.5) agrega un pequeño
 *                                 "retraso" suavizado. Default: true.
 * - pinStart: string           → posición de inicio del pin. Default: 'top top'.
 * - className / canvasClassName → clases extra para el wrapper / canvas.
 * - loader: ReactNode          → UI de carga custom (reemplaza la default).
 * - onFramesLoaded: () => void → callback cuando terminó de precargar todo.
 * - debug: boolean             → muestra los markers de ScrollTrigger.
 */
export default function ImageSequenceViewer({
  frameUrls = [],
  scrollLength = 3,
  scrub = true,
  pinStart = 'top top',
  className = '',
  canvasClassName = '',
  loader = null,
  onFramesLoaded,
  debug = false,
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const dimsRef = useRef({ width: 0, height: 0 });
  const currentFrameRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Si `frameUrls` cambia (nueva secuencia), reseteamos el estado de carga.
  // Se ajusta durante el render en vez de en un useEffect (guardando la
  // referencia anterior en estado, no en un ref): es el patrón que
  // recomienda React para "resetear estado cuando cambia una prop", sin
  // el setState síncrono-en-efecto que dispara un render en cascada.
  const [prevFrameUrls, setPrevFrameUrls] = useState(frameUrls);
  if (frameUrls !== prevFrameUrls) {
    setPrevFrameUrls(frameUrls);
    setIsReady(false);
    setLoadProgress(0);
  }

  // --- 1. Precarga de todos los frames antes de animar nada ---
  useEffect(() => {
    if (!frameUrls.length) return undefined;

    let cancelled = false;
    let loadedCount = 0;
    const images = new Array(frameUrls.length);
    currentFrameRef.current = 0;

    Promise.all(
      frameUrls.map((src, index) =>
        loadImage(src).then((img) => {
          images[index] = img;
          loadedCount += 1;
          if (!cancelled) setLoadProgress(loadedCount / frameUrls.length);
        })
      )
    ).then(() => {
      if (cancelled) return;
      imagesRef.current = images;
      setIsReady(true);
      onFramesLoaded?.();
    });

    return () => {
      cancelled = true;
    };
  }, [frameUrls, onFramesLoaded]);

  // --- 2. Dibuja un frame en el canvas, con ajuste tipo "cover" ---
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimsRef.current;
    if (!width || !height) return;

    const canvasRatio = width / height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // --- 3. Pin + scrub del scroll una vez que hay frames listos ---
  const scope = useGSAP(
    (gsap, ScrollTrigger) => {
      if (!isReady || !canvasRef.current) return undefined;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const totalFrames = imagesRef.current.length;

      const resizeCanvas = () => {
        // Cap del devicePixelRatio para no reventar el tamaño del canvas
        // (y el costo de cada drawImage) en pantallas 3x/4x.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        dimsRef.current = { width, height };
        drawFrame(currentFrameRef.current);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const trigger = ScrollTrigger.create({
        trigger: canvasRef.current,
        start: pinStart,
        end: () => `+=${scrollLength * window.innerHeight}`,
        pin: true,
        scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: debug,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            totalFrames - 1,
            Math.floor(self.progress * totalFrames)
          );
          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
        },
      });

      // Defensivo: si algo (fuentes, imágenes pesadas, layout shift) corrió
      // después de que ScrollTrigger midió el trigger por primera vez, esto
      // corrige start/end. Normalmente ScrollTrigger ya se auto-refresca
      // solo en el próximo frame, pero forzarlo acá no tiene costo real.
      requestAnimationFrame(() => ScrollTrigger.refresh());

      // Se ejecuta al desmontar o al re-crear el efecto (deps abajo).
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        trigger.kill();
      };
    },
    [isReady, scrollLength, scrub, pinStart, debug, drawFrame]
  );

  // OJO: el wrapper NO debe tener una altura fija (h-screen) ni
  // overflow-hidden. GSAP pinea el <canvas> y lo envuelve en un
  // "pin-spacer" que crece hasta `scrollLength` vh para reservar el
  // espacio de scroll en el documento; si el wrapper tuviera altura fija
  // recortaría ese spacer y el pin nunca liberaría el scroll real.
  // La altura de 100vh vive en el propio canvas.
  return (
    <div ref={scope} className={`relative w-full bg-black ${className}`}>
      <canvas ref={canvasRef} className={`block h-screen w-full ${canvasClassName}`} />

      {!isReady &&
        (loader ?? (
          <div className="absolute inset-0 flex h-screen items-center justify-center bg-black">
            <span className="text-sm tracking-widest text-neutral-400">
              Cargando secuencia… {Math.round(loadProgress * 100)}%
            </span>
          </div>
        ))}
    </div>
  );
}
