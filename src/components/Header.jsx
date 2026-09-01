/**
 * HEADER
 * -------
 * Fijo, transparente, sobre el video de portada (que ahora ocupa toda
 * la pantalla y cambia de frame con el scroll — a veces claro, a veces
 * oscuro). `mix-blend-mode: difference` sobre texto blanco: el mismo
 * truco que tenía el sitio antes de la limpieza — el color post-blend
 * se invierte solo según lo que haya debajo, así el logo se lee
 * SIEMPRE, sin importar qué frame del video esté pasando en ese
 * instante. Sin esto, un logo blanco fijo desaparecería contra los
 * tramos claros del video, y uno oscuro fijo desaparecería contra los
 * tramos oscuros — hacía falta que se ajuste solo.
 *
 * Logo chico y centrado (no arriba a la izquierda como antes) —
 * pedido explícito. Es texto, no una imagen: el wordmark del cliente
 * es tipográfico (mismo look que aparece en el propio video, "Studios"
 * + "Fein" corridos) y ya tenemos su tipografía real (Helvetica Neue
 * Bold) cargada — texto real en vez de un PNG se ve nítido a cualquier
 * tamaño/densidad de pantalla y no pesa nada.
 *
 * "Hablemos" queda a la derecha, mismo tratamiento de blend.
 *
 * Único lugar del sitio con blanco/negro puros en vez de `paper`/`ink`
 * de la paleta — a propósito: `mix-blend-mode: difference` invierte
 * matemáticamente el color debajo restando canal por canal, y solo da
 * una inversión limpia (blanco↔negro) con los extremos puros (0,0,0)/
 * (255,255,255). Con `ink` (#2A2A2A, no negro puro) el resultado sería
 * un gris apagado en vez de invertir de verdad — dejaría de leerse
 * bien contra los tramos oscuros del video.
 */
export default function Header() {
  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-end px-6 py-6 text-white md:px-16"
      style={{ mixBlendMode: 'difference' }}
    >
      {/* text-[21px] = 14px (text-sm) × 1.5 — pedido explícito de
          agrandar el logo del header. */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[21px] font-bold tracking-tight">
        StudiosFein<span className="align-super text-[0.55em]">®</span>
      </span>

      <a
        href="#contacto"
        className="group pointer-events-auto inline-block rounded-sm text-sm font-medium tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Hablemos
        <span className="mt-0.5 block h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
      </a>
    </header>
  );
}
