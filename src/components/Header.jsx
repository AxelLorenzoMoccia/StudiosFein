/**
 * HEADER
 * -------
 * Nav fija y mínima: wordmark a la izquierda, link de contacto a la
 * derecha. Sin fondo propio — usa `mix-blend-mode: difference` sobre
 * texto blanco, así se auto-invierte según lo que haya scrolleando
 * debajo (blanco sobre las secciones oscuras, negro sobre las claras
 * como AIGallery/ServicesSection) sin necesidad de detectar con JS en
 * qué sección está el usuario. Es el mismo truco que usan sitios como
 * Stripe/Linear para una nav que "sabe" adaptarse sola.
 */
export default function Header() {
  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-16"
      style={{ mixBlendMode: 'difference' }}
    >
      <span className="select-none text-lg font-semibold tracking-tight text-white">Fein</span>
      {/* Nota: acá NO se puede usar el dorado de acento — con
          mix-blend-mode: difference en el header, cualquier color que no
          sea blanco/negro sale distorsionado al mezclarse con el fondo.
          El "acento" queda en el subrayado animado en vez del color. */}
      <a href="#contacto" className="group pointer-events-auto text-sm font-medium tracking-wide text-white">
        Hablemos
        <span className="mt-0.5 block h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
      </a>
    </header>
  );
}
