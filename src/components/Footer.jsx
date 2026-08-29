/**
 * FOOTER
 * -------
 * Estático, sin animación — cierra el scroll sin pedirle nada más al
 * usuario. `getFullYear()` para no tener que acordarse de actualizar
 * el año a mano cada enero.
 *
 * (El botón de contacto que estuvo acá un commit se movió al bloque
 * de ContactSection.jsx, debajo de "Hablemos." — ahí es donde tenía
 * que estar realmente, no como recordatorio aparte al pie del sitio.)
 */
export default function Footer() {
  return (
    <footer className="w-full bg-fein-dark px-6 pb-10 pt-16 text-center md:px-16">
      <span className="mx-auto mb-8 block h-px w-16 bg-accent/40" aria-hidden="true" />
      <p className="text-sm text-neutral-500">Fein — Estudio de diseño e identidad de marca.</p>
      <p className="mt-2 text-xs text-neutral-600">
        © {new Date().getFullYear()} Fein. Todos los derechos reservados.
      </p>
    </footer>
  );
}
