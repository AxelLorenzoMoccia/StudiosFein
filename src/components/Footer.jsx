/**
 * FOOTER
 * -------
 * Estático, sin animación — cierra el scroll sin pedirle mucho más al
 * usuario, salvo un último recordatorio de contacto. `getFullYear()`
 * para no tener que acordarse de actualizar el año a mano cada enero.
 *
 * Botón "Hablemos": mismo destino (`#contacto`) que el link del
 * Header, pero un escalón más discreto — contorno, no relleno — que
 * el CTA blanco sólido de ContactSection.jsx, que está apenas arriba
 * y ya es el CTA primario de esa vista (DESIGN.md §6: "un solo CTA
 * primario por vista"). Acá es más un recordatorio de cierre que una
 * invitación nueva.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-fein-dark px-6 pb-10 pt-16 text-center md:px-16">
      <span className="mx-auto mb-8 block h-px w-16 bg-accent/40" aria-hidden="true" />

      <a
        href="#contacto"
        className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-accent-light hover:text-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Hablemos
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </a>

      <p className="mt-10 text-sm text-neutral-500">Fein — Estudio de diseño e identidad de marca.</p>
      <p className="mt-2 text-xs text-neutral-600">
        © {new Date().getFullYear()} Fein. Todos los derechos reservados.
      </p>
    </footer>
  );
}
