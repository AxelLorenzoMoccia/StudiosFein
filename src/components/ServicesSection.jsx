import { useId, useMemo } from 'react';
import { Film, MonitorSmartphone, PenTool, ShoppingBag } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';

const SERVICES = [
  {
    icon: PenTool,
    title: 'Identidad de marca',
    text: 'Logotipos, sistemas visuales y guías de marca pensadas para sostenerse en el tiempo, no solo para el lanzamiento.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Diseño digital',
    text: 'Sitios y productos digitales con una premisa simple: que se sientan tan bien como se ven.',
  },
  {
    icon: Film,
    title: 'Motion y producción',
    text: 'Animación, video y contenido en movimiento para que la marca no se quede quieta en ningún lado.',
  },
  {
    icon: ShoppingBag,
    title: 'Producto y merchandising',
    text: 'Objetos, prendas y piezas físicas que llevan la identidad de marca más allá de la pantalla.',
  },
];

/**
 * Textura de fondo de cada tarjeta: un puñado de cuadrados de una grilla
 * punteada, resaltados al azar — el mismo recurso que ya usa `.bg-fein-dark`
 * (atmósfera en capas en vez de color plano, ver DESIGN.md §2), aplicado acá
 * en versión clara para que funcione sobre `bg-neutral-50`.
 */
function randomHighlightedSquares(count = 5) {
  return Array.from({ length: count }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}

function GridPattern({ width, height, squares, className }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" className={className}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x="-1" y="-1">
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      <svg x="-1" y="-1" className="overflow-visible">
        {squares.map(([sx, sy], index) => (
          <rect key={index} strokeWidth="0" width={width + 1} height={height + 1} x={sx * width} y={sy * height} />
        ))}
      </svg>
    </svg>
  );
}

/**
 * Tarjeta de servicio individual — layout base (grilla con divisores, ícono,
 * textura de fondo) adaptado de "Grid Feature Cards" de 21st.dev
 * (github.com/sshahaider, vía MCP de 21st.dev), reescrito sin TypeScript, sin
 * framer-motion (acá el motion es GSAP, ver useGSAP.js) y sin el helper `cn`
 * de shadcn (no está configurado en este proyecto) — y recoloreado para nuestra
 * paleta clara en vez del tema oscuro genérico del original.
 */
function ServiceCard({ icon: Icon, title, text }) {
  const squares = useMemo(() => randomHighlightedSquares(), []);

  return (
    <div data-service-card className="group relative overflow-hidden p-8">
      <GridPattern
        width={20}
        height={20}
        squares={squares}
        className="pointer-events-none absolute inset-0 h-full w-full fill-neutral-950/[0.025] stroke-neutral-950/10 [mask-image:radial-gradient(farthest-side_at_top_left,white,transparent)]"
      />
      <Icon className="relative h-6 w-6 text-accent" strokeWidth={1.25} aria-hidden="true" />
      <h3 className="relative mt-8 text-xl font-semibold md:text-2xl">{title}</h3>
      <p className="relative mt-3 leading-relaxed text-neutral-600">{text}</p>
      <span className="relative mt-6 block h-px w-8 bg-neutral-200 transition-all duration-300 group-hover:w-16 group-hover:bg-accent" />
    </div>
  );
}

/**
 * SERVICIOS — "qué hacemos"
 * --------------------------
 * Grilla de tarjetas con fade-up + stagger al entrar en viewport
 * (ScrollTrigger.batch, un solo listener por lote en vez de un ScrollTrigger
 * por tarjeta). Fondo claro — sigue el ritmo que arranca WeavyTransition.jsx
 * justo antes de esta sección; por eso, a diferencia del componente de
 * origen (tema oscuro), esta versión quedó recoloreada para bg-neutral-50.
 */
export default function ServicesSection() {
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-service-card]', { opacity: 0, y: 40 });

    ScrollTrigger.batch('[data-service-card]', {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          overwrite: true,
        }),
    });
  });

  return (
    <section ref={scope} className="w-full bg-neutral-50 px-6 py-24 text-neutral-950 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Servicios
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-semibold md:text-5xl">Qué hacemos</h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-neutral-200 border border-neutral-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
