import { useGSAP } from '../hooks/useGSAP';

/**
 * 1. INTRO
 * --------
 * El logo "Fein" centrado en pantalla. Al scrollear, el logo se
 * desvanece mientras toda la escena hace un "zoom in" (scale), como
 * si la cámara avanzara a través del logo hacia la siguiente sección.
 *
 * Todo corre dentro de un único timeline con scrollTrigger + scrub,
 * pineado durante 100% de la altura del viewport (`end: '+=100%'`):
 * el fade del logo termina rápido (duration 0.4 de 1) mientras el
 * scale sigue creciendo hasta el final del pin (duration 1).
 *
 * OJO con la estructura de divs (mismo motivo que en
 * ImageSequenceViewer): el elemento que GSAP *pinea* no puede tener
 * a la vez altura fija Y ser el que hace `overflow-hidden` sobre SU
 * PROPIO contenido escalado si ese overflow-hidden vive en un
 * ancestro con altura fija — rompería el pin-spacer. Por eso separamos
 * en dos capas:
 *   - [data-intro-pin]:   lo que GSAP pinea. h-screen + overflow-hidden
 *                         (la "ventana" que recorta el zoom al viewport).
 *   - [data-intro-scale]: lo que efectivamente se escala, adentro.
 * El <section> de más afuera queda con altura automática para que el
 * pin-spacer (que GSAP inserta reemplazando a [data-intro-pin]) pueda
 * crecer y reservar el espacio real de scroll.
 */
export default function IntroSection() {
  const scope = useGSAP((gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-intro-pin]',
        start: 'top top',
        end: '+=100%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to('[data-intro-logo]', { opacity: 0, ease: 'none', duration: 0.4 }, 0).to(
      '[data-intro-scale]',
      { scale: 6, ease: 'none', duration: 1 },
      0
    );
  });

  return (
    <section ref={scope} className="relative w-full bg-neutral-950">
      <div data-intro-pin className="relative h-screen w-full overflow-hidden">
        <div
          data-intro-scale
          className="flex h-full w-full items-center justify-center will-change-transform"
        >
          <h1
            data-intro-logo
            className="select-none text-[20vw] font-semibold leading-none tracking-tight text-white md:text-[14vw]"
          >
            Fein
          </h1>
        </div>
      </div>
    </section>
  );
}
