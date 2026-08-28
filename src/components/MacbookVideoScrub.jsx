import { useState } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import TshirtHologram from './TshirtHologram';
import MacbookOpenReveal from './MacbookOpenReveal';

/**
 * MACBOOK VIDEO SCRUB
 * --------------------
 * Segundo escalón del fallback (ver MacbookSequenceSection.jsx):
 * cuando todavía no hay una secuencia de FOTOS (`ImageSequenceViewer`)
 * pero SÍ hay un video de referencia en `src/assets/videos/`, este
 * componente lo pinea y engancha su `currentTime` 1:1 al scroll — la
 * misma idea de "scrubbing" que ImageSequenceViewer, pero manejando
 * un solo <video> en vez de dibujar cientos de imágenes en un canvas.
 *
 * Es la forma MÁS RÁPIDA de meter un video ya filmado/renderizado al
 * sitio sin procesarlo: no hace falta extraer frames (eso pide
 * ffmpeg, que no está instalado acá). La diferencia con
 * ImageSequenceViewer es de PRECISIÓN al scrollear rápido: seekear un
 * video depende de cada cuántos frames tenga un "keyframe" propio
 * (GOP) en su compresión — si el video no fue codificado pensando en
 * esto, un scroll muy brusco puede saltar en vez de deslizar
 * perfectamente suave. Para el render FINAL, lo ideal sigue siendo
 * exportar la animación como una secuencia de imágenes (con Blender,
 * por ejemplo) y usar ImageSequenceViewer — pero como demo/placeholder
 * con un clip ya existente, esto anda perfecto.
 *
 * Una vez que el video llega casi al final (ver `label('handoff')`),
 * se desvanece y aparece la misma <TshirtHologram /> que usa
 * MacbookOpenReveal.jsx — girando y cambiando de estampa como un
 * "holograma" saliendo de la laptop, tal como se describió el video
 * de referencia (la Mac se abre y se corre a un lado para dejar
 * lugar a la remera).
 *
 * `videoSrc` lo resuelve MacbookSequenceSection.jsx (busca en
 * src/assets/videos/) y lo pasa por prop — así el `import.meta.glob`
 * de assets queda todo junto en ese archivo "índice", igual que con
 * los frames y los logos.
 */
export default function MacbookVideoScrub({ videoSrc, scrollLength = 3.5, debug = false }) {
  const [isReady, setIsReady] = useState(false);
  // Si el video no puede reproducirse (códec no soportado por el
  // navegador, archivo corrupto, etc.), no nos quedamos trabados en
  // "Cargando video…" para siempre: caemos al fallback 100%
  // ilustrado, que no depende de ningún asset externo.
  const [hasError, setHasError] = useState(false);

  const scope = useGSAP(
    (gsap) => {
      if (!isReady) return undefined;

      const video = document.querySelector('[data-mb-video]');
      if (!video) return undefined;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-mbv-pin]',
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: debug,
        },
      });

      // El video ocupa el primer 70% del recorrido pineado — scrubbeado
      // 1:1 (`currentTime` sigue exactamente el progreso del scroll,
      // sin easing: es lo correcto acá, igual que el rotateY de la
      // remera, porque tiene que sentirse "atado" a la mano).
      tl.to(video, { currentTime: video.duration || 0, duration: 3.5, ease: 'none' }, 0)

        // handoff: el video se desvanece y la remera "holograma" sube.
        .addLabel('handoff', 2.6)
        .to('[data-mb-video]', { opacity: 0, duration: 0.5 }, 'handoff')
        .fromTo(
          '[data-tshirt-wrap]',
          { opacity: 0, y: 40, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
          'handoff+=0.2'
        )
        .addLabel('spin1', 'handoff+=1')
        .to('[data-tshirt]', { rotateY: 240, duration: 1.2, ease: 'none' }, 'spin1')
        .to('[data-print-a]', { opacity: 0, duration: 0.3 }, 'spin1')
        .to('[data-print-b]', { opacity: 1, duration: 0.3 }, 'spin1')
        .addLabel('spin2', 'spin1+=1.2')
        .to('[data-tshirt]', { rotateY: 480, duration: 1.2, ease: 'none' }, 'spin2')
        .to('[data-print-b]', { opacity: 0, duration: 0.3 }, 'spin2')
        .to('[data-print-c]', { opacity: 1, duration: 0.3 }, 'spin2');

      // Balanceo aéreo de la remera, independiente del scroll — mismo
      // motivo que en MacbookOpenReveal.jsx: un repeat:-1 adentro de
      // un timeline scrubbeado no se movería solo.
      const bob = gsap.to('[data-tshirt]', {
        y: -14,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      return () => bob.kill();
    },
    [isReady, scrollLength, debug]
  );

  if (hasError) {
    return <MacbookOpenReveal scrollLength={scrollLength} debug={debug} />;
  }

  return (
    <section ref={scope} className="relative w-full bg-fein-dark">
      <div
        data-mbv-pin
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <video
          data-mb-video
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setIsReady(true)}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />

        {!isReady && (
          <div className="absolute inset-0 flex h-screen items-center justify-center bg-fein-dark">
            <span className="text-sm tracking-widest text-neutral-400">Cargando video…</span>
          </div>
        )}

        <TshirtHologram />
      </div>
    </section>
  );
}
