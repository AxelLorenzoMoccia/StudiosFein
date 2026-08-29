/**
 * TSHIRT HOLOGRAM
 * ----------------
 * La remera blanca flotante con sombreado tipo "maniquí invisible" y
 * 3 estampas intercambiables — el mismo elemento visual que antes
 * vivía adentro de MacbookOpenReveal.jsx, separado a su propio
 * archivo porque ahora lo usan DOS secuencias distintas:
 *   - MacbookOpenReveal.jsx (fallback 100% ilustrado)
 *   - MacbookVideoScrub.jsx (video de referencia + esta remera "tipo
 *     holograma" saliendo cuando la laptop se corre a un costado)
 *
 * Es puramente presentacional — no anima nada por sí sola. Expone los
 * mismos `data-*` de siempre (`data-tshirt-wrap`, `data-tshirt`,
 * `data-print-a/b/c`) para que el timeline de GSAP del componente
 * padre la controle por selector, sin que importe cuál de los dos la
 * haya renderizado (gsap.context() sólo necesita que estos nodos
 * cuelguen del `scope` del padre, no le importa de qué componente
 * React vinieron).
 *
 * Nada dibuja un cuerpo, pero la luz/sombra sí lo sugiere: pecho
 * iluminado como si lo empujara un torso, costados y axilas
 * oscurecidos como si la tela cayera desde ahí, mangas con volumen de
 * cilindro. La luz viene de arriba-izquierda para que combine con el
 * resto de la escena.
 *
 * Estampas — placeholders vectoriales. Reemplazar por arte real (por
 * ej. import.meta.glob desde src/assets/prints/) cuando el equipo de
 * diseño entregue las estampas finales; alcanza con swappear el
 * contenido de estos 3 <svg>, las animaciones del padre no cambian.
 * `mix-blend-multiply` hace que la tinta se funda con el sombreado de
 * la tela en vez de leerse como un sticker flotando encima.
 */
export default function TshirtHologram() {
  return (
    <div
      data-tshirt-wrap
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
      style={{ perspective: '1200px' }}
    >
      <div
        data-tshirt
        className="relative h-64 w-64 sm:h-80 sm:w-80"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
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

          {/* Todo lo de acá abajo queda recortado a la silueta — son
              capas de luz/sombra, no formas nuevas. */}
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

            {/* Pliegues — siguen la curva de un pecho/torso real en vez
                de líneas derechas cruzando la prenda. */}
            <path d="M22,52 Q50,60 78,50" fill="none" stroke="#c9c9c9" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
            <path d="M25,72 Q50,79 75,71" fill="none" stroke="#c9c9c9" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            <path d="M30,20 Q40,26 34,34" fill="none" stroke="#c9c9c9" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
          </g>

          {/* Sombra del cuello — el hueco antes de la cuellera, para
              que la cuellera lea como un borde con grosor apoyado
              sobre algo hundido, no una línea flotando en el aire. */}
          <ellipse cx="50" cy="10" rx="9" ry="3" fill="#000000" opacity="0.3" filter="url(#tshirt-soft)" />
          <path d="M42,6 Q50,15 58,6" fill="none" stroke="#f0f0f0" strokeWidth="2.2" strokeLinecap="round" />
        </svg>

        <svg data-print-a viewBox="0 0 100 100" className="absolute inset-0 h-full w-full mix-blend-multiply">
          <circle cx="50" cy="48" r="12" className="fill-neutral-900" />
          <text x="50" y="52.5" textAnchor="middle" className="fill-white font-bold" style={{ fontSize: '12px' }}>
            F
          </text>
        </svg>
        <svg data-print-b viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-0 mix-blend-multiply">
          <g className="stroke-neutral-900" strokeWidth="3" strokeLinecap="round">
            <line x1="38" y1="38" x2="46" y2="58" />
            <line x1="47" y1="38" x2="55" y2="58" />
            <line x1="56" y1="38" x2="64" y2="58" />
          </g>
        </svg>
        <svg data-print-c viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-0 mix-blend-multiply">
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
  );
}
