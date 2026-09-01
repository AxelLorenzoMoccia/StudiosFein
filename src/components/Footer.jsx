/**
 * FOOTER
 * -------
 * Estático, sin animación — cierra el scroll sin pedirle nada más al
 * usuario. `getFullYear()` para no tener que acordarse de actualizar
 * el año a mano cada enero.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-paper px-6 pb-10 pt-16 text-center md:px-16">
      <span className="mx-auto mb-8 block h-px w-16 bg-stone" aria-hidden="true" />
      <p className="text-sm text-ink">StudiosFein — Estudio de diseño e identidad de marca.</p>
      <p className="mt-2 text-xs font-light text-ink">
        © {new Date().getFullYear()} StudiosFein. Todos los derechos reservados.
      </p>
    </footer>
  );
}
