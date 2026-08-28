import { useGSAP } from '../hooks/useGSAP';

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
      .to(
        '[data-mb-closed], [data-mb-edge]',
        { scaleY: 0, rotationZ: -6, duration: 1, ease: 'power2.in' },
        'flip'
      )
      .set('[data-mb-closed]', { opacity: 0 }, 'flip+=1')
      .set('[data-mb-open]', { opacity: 1 }, 'flip+=1')
      // 2. La laptop abierta se despliega desde ese mismo canto, con un
      //    pequeño "overshoot" (back.out) para que se sienta menos
      //    mecánica, como si el propio impulso de abrirla la pasara
      //    de largo un toque antes de asentarse.
      .from(
        '[data-mb-open], [data-mb-edge]',
        { scaleY: 0, rotationZ: 6, duration: 1, ease: 'back.out(1.5)' },
        'flip+=1'
      )
      .to('[data-mb-screen]', { opacity: 1, duration: 0.6 }, 'flip+=1.3')

      // 3. La laptop pasa a segundo plano y la remera sube flotando
      .addLabel('reveal', 'flip+=2')
      .to('[data-mb-rig]', { scale: 0.88, opacity: 0.25, duration: 1 }, 'reveal')
      .fromTo(
        '[data-tshirt-wrap]',
        { opacity: 0, y: 60, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)' },
        'reveal'
      )

      // 4. La remera gira (rotateY) mientras va cambiando de estampa
      .addLabel('spin1', 'reveal+=1')
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
    <section ref={scope} className="relative w-full bg-neutral-950">
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
        <div
          data-tshirt-wrap
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
          style={{ perspective: '1200px' }}
        >
          <div
            data-tshirt
            className="relative h-64 w-64 sm:h-80 sm:w-80"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
          >
            {/* Sombreado tipo "maniquí invisible": nada dibuja un cuerpo,
                pero la luz/sombra sí lo sugiere — pecho iluminado como si
                lo empujara un torso, costados y axilas oscurecidos como
                si la tela cayera desde ahí, mangas con volumen de
                cilindro. La luz viene de arriba-izquierda (mismo lado
                que el brillo de la laptop) para que toda la escena
                comparta una sola fuente de luz. */}
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <clipPath id="tshirt-clip">
                  <path d="M42,6 Q50,16 58,6 L72,10 L94,26 Q98,34 90,40 L76,32 L76,96 L24,96 L24,32 L10,40 Q2,34 6,26 L28,10 Z" />
                </clipPath>
                <filter id="tshirt-soft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>

                <linearGradient id="ts-base" x1="20%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#fcfcfc" />
                  <stop offset="100%" stopColor="#dcdcdc" />
                </linearGradient>
                <radialGradient id="ts-chest" cx="46%" cy="30%" r="46%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ts-shadow-l" x1="0%" x2="42%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ts-shadow-r" x1="100%" x2="58%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="ts-sleeve-l" cx="12%" cy="27%" r="16%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ts-sleeve-r" cx="88%" cy="27%" r="14%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ts-hem" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="82%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
                </linearGradient>
              </defs>

              {/* Silueta base */}
              <path
                d="M42,6 Q50,16 58,6 L72,10 L94,26 Q98,34 90,40 L76,32 L76,96 L24,96 L24,32 L10,40 Q2,34 6,26 L28,10 Z"
                fill="url(#ts-base)"
                className="stroke-neutral-300"
                strokeWidth="1.5"
              />

              {/* Todo lo de acá abajo queda recortado a la silueta —
                  son capas de luz/sombra, no formas nuevas. */}
              <g clipPath="url(#tshirt-clip)">
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-chest)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-shadow-l)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-shadow-r)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-sleeve-l)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-sleeve-r)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#ts-hem)" />

                {/* Sombra de axila — donde la manga "cae" contra el
                    cuerpo, el punto más oscuro de toda la prenda. */}
                <ellipse cx="18" cy="35" rx="7" ry="6" fill="#000000" opacity="0.28" filter="url(#tshirt-soft)" />
                <ellipse cx="82" cy="35" rx="7" ry="6" fill="#000000" opacity="0.32" filter="url(#tshirt-soft)" />

                {/* Pliegues — siguen la curva de un pecho/torso real en
                    vez de líneas derechas cruzando la prenda. */}
                <path d="M22,52 Q50,60 78,50" fill="none" stroke="#c9c9c9" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
                <path d="M25,72 Q50,79 75,71" fill="none" stroke="#c9c9c9" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                <path d="M30,20 Q40,26 34,34" fill="none" stroke="#c9c9c9" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
              </g>

              {/* Sombra del cuello — el hueco antes de la cuellera, para
                  que la cuellera lea como un borde con grosor apoyado
                  sobre algo hundido, no una línea flotando en el aire. */}
              <ellipse cx="50" cy="10" rx="9" ry="3" fill="#000000" opacity="0.3" filter="url(#tshirt-soft)" />
              <path
                d="M42,6 Q50,15 58,6"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Estampas — placeholders vectoriales. Reemplazar por arte
                real (por ej. import.meta.glob desde
                src/assets/prints/) cuando el equipo de diseño entregue
                las estampas finales; alcanza con swappear el contenido
                de estos 3 <svg>, las animaciones no cambian.
                `mix-blend-multiply` hace que la tinta se funda con el
                sombreado de la tela en vez de leerse como un sticker
                flotando encima. */}
            <svg
              data-print-a
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full mix-blend-multiply"
            >
              <circle cx="50" cy="48" r="12" className="fill-neutral-900" />
              <text
                x="50"
                y="52.5"
                textAnchor="middle"
                className="fill-white font-bold"
                style={{ fontSize: '12px' }}
              >
                F
              </text>
            </svg>
            <svg
              data-print-b
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full opacity-0 mix-blend-multiply"
            >
              <g className="stroke-neutral-900" strokeWidth="3" strokeLinecap="round">
                <line x1="38" y1="38" x2="46" y2="58" />
                <line x1="47" y1="38" x2="55" y2="58" />
                <line x1="56" y1="38" x2="64" y2="58" />
              </g>
            </svg>
            <svg
              data-print-c
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full opacity-0 mix-blend-multiply"
            >
              <g className="fill-neutral-900">
                <circle cx="41" cy="42" r="2" />
                <circle cx="52" cy="51" r="3" />
                <circle cx="60" cy="41" r="1.5" />
                <circle cx="46" cy="58" r="1.5" />
                <circle cx="58" cy="58" r="2.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
