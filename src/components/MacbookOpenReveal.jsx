import { useGSAP } from '../hooks/useGSAP';
import TshirtHologram from './TshirtHologram';

/**
 * MACBOOK OPEN REVEAL — versión ilustrada (CSS + SVG + GSAP), sin fotos.
 * =======================================================================
 * Se usa como *fallback* dentro de MacbookSequenceSection.jsx mientras
 * no haya frames reales en `src/assets/frames/macbook/`. El día que
 * lleguen fotos o renders, ImageSequenceViewer toma la posta solo — no
 * hace falta borrar ni tocar este archivo.
 *
 * Técnica del "flip":
 * En vez de rotar la tapa en 3D de verdad (lo que obliga a resolver
 * backface-visibility con cuidado para que no se vea "al revés" a
 * mitad de camino), la laptop cerrada y la laptop abierta son dos
 * tarjetas superpuestas que se cruzan en un flip de `scaleY`: la
 * cerrada se aplasta a 0 (como una hoja girando de canto) justo cuando
 * la abierta empieza a desplegarse desde 0. El cruce es invisible
 * porque ambas pasan por scaleY≈0 en el mismo instante del timeline.
 *
 * La remera sí usa `perspective` + `rotateY` real (ahí no hay dos caras
 * que reconciliar, es un solo plano), atado 1:1 al scroll, más un
 * balanceo vertical infinito e independiente del scroll para que se
 * sienta "viva"/aérea mientras gira y va cambiando de estampa.
 *
 * "Proyectada por la pantalla": la laptop no desaparece, se corre a
 * un costado (queda visible ahí) y la remera emerge diminuta desde el
 * punto de la pantalla — con un flash de luz [data-mb-beam] — para
 * después volar y crecer hasta su lugar del otro lado. Todo con `x`
 * en `vw` (no `%`, que en GSAP es relativo al tamaño del propio
 * elemento) para que el corrimiento sea real independientemente de lo
 * chica que sea la tarjeta de la laptop o el wrapper de la remera.
 *
 * Nota sobre animaciones infinitas dentro de un timeline scrubbeado:
 * un tween con `repeat: -1` DENTRO de `tl` no se movería solo (el
 * playhead de `tl` está atado 1:1 al scroll, no corre por su cuenta).
 * Por eso el balanceo de la remera y el sway de los stickers son
 * `gsap.to()` sueltos, fuera de `tl`.
 */
export default function MacbookOpenReveal({ scrollLength = 3.5, debug = false }) {
  const scope = useGSAP((gsap) => {
    // --- Timeline principal: atado 1:1 al scroll mientras la sección está pineada ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-mb-pin]',
        start: 'top top',
        end: () => `+=${scrollLength * window.innerHeight}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: debug,
      },
    });

    tl.addLabel('flip')
      // 1. La tapa cerrada se aplasta a 0 (canto invisible) con un
      //    leve giro en Z, como si la tapa realmente se despegara
      //    hacia un costado en vez de un aplastamiento puramente plano.
      // [data-mb-edge] (el canto grueso detrás de la tapa) se squishea
      // junto con lo que esté visible, para que el "grosor" nunca quede
      // desincronizado del panel que lo trae puesto.
      //
      // `feinOut` en vez de `power2.in`: "entra o sale → ease-out" es
      // la regla (skill emil-design-eng/apple-design) tanto para lo
      // que aparece COMO para lo que se va — un ease-in acá arranca
      // lento y se siente laggeado justo en el instante en que el ojo
      // está mirando. `power2.in` era literalmente la regla al revés.
      .to(
        '[data-mb-closed], [data-mb-edge]',
        { scaleY: 0, rotationZ: -6, duration: 1, ease: 'feinOut' },
        'flip'
      )
      .set('[data-mb-closed]', { opacity: 0 }, 'flip+=1')
      .set('[data-mb-open]', { opacity: 1 }, 'flip+=1')
      // 2. La laptop abierta se despliega desde ese mismo canto.
      //    Antes tenía overshoot (`back.out`) para que "pasara de
      //    largo" un toque. Se saca: este movimiento está atado 1:1 al
      //    scroll (no es una animación que corre sola tras un gesto),
      //    y el principio de "direct manipulation" de Apple es
      //    justamente que algo trackeado en vivo no rebota por su
      //    cuenta — el rebote se reserva para gestos con momentum
      //    (flicks, drag-to-dismiss), no para algo que el usuario está
      //    controlando con la rueda del mouse en ese instante.
      .from(
        '[data-mb-open], [data-mb-edge]',
        { scaleY: 0, rotationZ: 6, duration: 1, ease: 'feinOut' },
        'flip+=1'
      )
      .to('[data-mb-screen]', { opacity: 1, duration: 0.6 }, 'flip+=1.3')

      // 3. La laptop se corre a un costado (no desaparece — "se acomoda"
      //    ahí, se queda visible) y un flash de la pantalla "proyecta"
      //    la remera, que emerge chiquita desde ese punto y vuela hacia
      //    su lugar del otro lado — como un holograma saliendo de la
      //    pantalla, no una prenda que apareció de la nada.
      .addLabel('reveal', 'flip+=2')
      .to('[data-mb-rig]', { x: '-15vw', scale: 0.72, duration: 1.1, ease: 'feinInOut' }, 'reveal')
      .fromTo(
        '[data-mb-beam]',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1.6, duration: 0.45, ease: 'power1.out' },
        'reveal+=0.55'
      )
      .to('[data-mb-beam]', { opacity: 0, duration: 0.5 }, 'reveal+=1')
      .fromTo(
        '[data-tshirt-wrap]',
        { opacity: 0, x: '-8vw', y: 10, scale: 0.12 },
        { opacity: 1, x: '15vw', y: 0, scale: 1, duration: 1.3, ease: 'feinOut' },
        'reveal+=0.45'
      )

      // 4. La remera gira (rotateY) mientras va cambiando de estampa
      .addLabel('spin1', 'reveal+=1.9')
      .to('[data-tshirt]', { rotateY: 240, duration: 1.2, ease: 'none' }, 'spin1')
      .to('[data-print-a]', { opacity: 0, duration: 0.3 }, 'spin1')
      .to('[data-print-b]', { opacity: 1, duration: 0.3 }, 'spin1')

      .addLabel('spin2', 'spin1+=1.2')
      .to('[data-tshirt]', { rotateY: 480, duration: 1.2, ease: 'none' }, 'spin2')
      .to('[data-print-b]', { opacity: 0, duration: 0.3 }, 'spin2')
      .to('[data-print-c]', { opacity: 1, duration: 0.3 }, 'spin2')

      .addLabel('spin3', 'spin2+=1.2')
      .to('[data-tshirt]', { rotateY: 720, duration: 1.6, ease: 'none' }, 'spin3')
      .to('[data-print-c]', { opacity: 0, duration: 0.3 }, 'spin3+=1')
      .to('[data-print-a]', { opacity: 1, duration: 0.3 }, 'spin3+=1');

    // --- Ambient, independiente del scroll ---
    // Balanceo aéreo de la remera (además del rotateY atado al scroll).
    const bob = gsap.to('[data-tshirt]', {
      y: -14,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Leve sway de los stickers de la tapa cerrada, para que no se
    // sientan "pegados" mientras el usuario todavía está en esa parte.
    const sway = gsap.to('[data-mb-sticker]', {
      rotation: '+=4',
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    return () => {
      bob.kill();
      sway.kill();
    };
  }, [scrollLength, debug]);

  return (
    <section ref={scope} className="relative w-full bg-fein-dark">
      <div
        data-mb-pin
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* ---------------- Laptop ---------------- */}
        <div data-mb-rig className="relative">
          {/* Sombra de apoyo — ancla la laptop al "piso" en vez de
              sentirse flotando sobre el fondo liso. Va antes en el DOM
              que las tarjetas para quedar debajo. Comparte scale/opacity
              con [data-mb-rig] (es su hijo), así que se achica y se
              apaga en sincro cuando la laptop pasa a segundo plano. */}
          <div className="absolute -bottom-6 left-1/2 h-6 w-48 -translate-x-1/2 rounded-full bg-black/50 blur-xl sm:w-64" />

          {/* "Canto" — el grosor del cuerpo de aluminio, asomando 5-6px
              atrás/abajo de la cara principal. Sin esto, cualquier
              tarjeta redondeada lee como una lámina de papel; con un
              borde más oscuro asomando, lee como un bloque con volumen.
              Comparte forma/tamaño con [data-mb-closed] a propósito. */}
          <div
            data-mb-edge
            className="absolute inset-0 translate-x-[5px] translate-y-[7px] rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-700 sm:translate-x-[6px] sm:translate-y-[8px]"
          />

          {/* Estado cerrado: tapa con logo + "stickers" de Fein.
              Placeholders — reemplazar por assets reales si el equipo
              de diseño entrega stickers/renders propios. */}
          <div
            data-mb-closed
            className="relative flex aspect-[4/3] w-64 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10 sm:w-80"
            style={{
              background:
                'linear-gradient(135deg, #f5f5f5 0%, #d4d4d4 45%, #a3a3a3 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -10px 18px -12px rgba(0,0,0,0.4), 0 40px 80px -20px rgba(0,0,0,0.65)',
            }}
          >
            {/* Brillo metálico — sheen diagonal sutil para que la tapa
                lea como aluminio y no como un rectángulo plano. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-black/10" />

            <span className="relative text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Fein
            </span>

            <span
              data-mb-sticker
              className="absolute -left-4 top-6 -rotate-12 select-none rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-medium tracking-widest text-white shadow-lg"
            >
              EST.
            </span>
            <span
              data-mb-sticker
              className="absolute -right-3 bottom-8 rotate-6 select-none rounded-md bg-white px-2 py-1 text-[10px] font-medium tracking-widest text-neutral-900 shadow-lg"
            >
              FEIN
            </span>
          </div>

          {/* Estado abierto: pantalla + deck. Oculto hasta el "flip". */}
          <div data-mb-open className="absolute inset-0 opacity-0">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.65)' }}>
              {/* Pantalla: bisel negro grueso alrededor del "vidrio" para
                  que se note que está hundido, no pegado a la superficie. */}
              <div className="relative flex flex-[5] items-center justify-center bg-neutral-950 p-3">
                <div
                  data-mb-screen
                  className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md opacity-0"
                  style={{ boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.85)' }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#404040,_#0a0a0a_70%)]" />
                  {/* Reflejo de vidrio — franja diagonal, como el brillo
                      típico de una pantalla al recibir luz de costado. */}
                  <div className="absolute -inset-y-4 left-[-20%] w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="relative text-xs font-medium tracking-[0.5em] text-neutral-100">
                    FEIN
                  </span>
                </div>

                {/* Flash de proyección — brilla un instante justo cuando
                    la remera "sale" de la pantalla, para vender la idea
                    de holograma. Fuera de [data-mb-screen] (que tiene
                    overflow hidden) para que el resplandor pueda
                    asomarse más allá del bisel. */}
                <div
                  data-mb-beam
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(147,197,253,0.55) 0%, rgba(147,197,253,0) 70%)',
                  }}
                />
              </div>

              {/* Bisagra — línea de sombra donde la pantalla se clava en
                  el deck, para separar visualmente ambos volúmenes. */}
              <div className="h-1.5 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

              {/* Deck: superficie superior + "labio" frontal más oscuro
                  (el canto del deck, visto de frente) para que no lea
                  como una franja plana pegada debajo de la pantalla. */}
              <div className="relative flex-[1]" style={{ background: 'linear-gradient(180deg, #e5e5e5 0%, #b5b5b5 75%, #999999 100%)' }}>
                <div className="absolute inset-0 overflow-hidden">
                  {/* Textura sutil de teclado — puro decorado, no son
                      teclas reales, solo sugiere la trama. */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.08)_0px,rgba(0,0,0,0.08)_2px,transparent_2px,transparent_9px)] opacity-40" />
                  <div
                    className="absolute left-1/2 top-1/2 h-1.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400/70"
                    style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}
                  />
                </div>
                {/* Labio frontal — el borde delantero del deck, un tono
                    bien más oscuro para marcar dónde termina la
                    superficie y empieza el canto. */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-neutral-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Remera ---------------- */}
        <TshirtHologram />
      </div>
    </section>
  );
}
