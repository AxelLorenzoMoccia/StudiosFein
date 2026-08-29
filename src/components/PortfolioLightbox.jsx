import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

/**
 * LIGHTBOX DE UNA PIEZA — carrusel ampliable
 * ---------------------------------------------
 * Tercera de las 3 mejoras priorizadas. Antes, tocar la tarjeta
 * central del carrusel no hacía nada — era una galería que no llevaba
 * a ningún lado. Ahora abre esto: la misma foto más grande, con su
 * copy completo y un único CTA de contacto (no uno por tarjeta como
 * se probó antes y se sacó — acá, en el momento en que alguien
 * explícitamente pidió ver más, sí tiene sentido ofrecerlo).
 *
 * Accesibilidad de modal, lo mínimo indispensable pero completo:
 * - `role="dialog"` + `aria-modal="true"` + `aria-label` con el
 *   nombre de la pieza.
 * - Foco se mueve al botón de cerrar al abrir, y vuelve al elemento
 *   que lo abrió al cerrar (se guarda `document.activeElement` antes
 *   de tocar nada).
 * - Escape cierra, click en el fondo (no en la tarjeta) cierra.
 * - Scroll del body bloqueado mientras está abierto — si no, se puede
 *   scrollear la página de atrás sin querer con el modal encima.
 *
 * `gsap` directo, no `useGSAP()` — mismo criterio que PageLoader.jsx
 * y useMagnetic.js: sin scroll ni selectores de texto de por medio,
 * un tween único sobre un ref concreto en cada apertura.
 */
export default function PortfolioLightbox({ item, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'feinOut' });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'feinOut', delay: 0.05 }
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const title = `${item.titleLine1}${item.titleLine2 ? ` ${item.titleLine2}` : ''}`;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 px-6 py-10 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-neutral-900 md:flex-row"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X aria-hidden="true" />
        </button>

        <img src={item.img} alt={title} className="h-64 w-full object-cover md:h-auto md:w-1/2" />

        <div className="flex flex-col justify-center gap-3 p-8 md:w-1/2">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent dark:text-accent-light">
            {item.tag}
          </span>
          <h3 className="text-2xl font-black uppercase leading-tight tracking-wide text-neutral-900 dark:text-white">
            {item.titleLine1}
            {item.titleLine2 && (
              <span className="block text-lg font-bold text-neutral-600 dark:text-neutral-300">
                {item.titleLine2}
              </span>
            )}
          </h3>
          <div className="h-0.5 w-8 rounded-full bg-accent dark:bg-accent-light" aria-hidden="true" />
          {item.desc && <p className="italic leading-relaxed text-neutral-600 dark:text-neutral-300">{item.desc}</p>}

          <a
            href="#contacto"
            onClick={onClose}
            className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-accent-light to-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#070707] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
          >
            Contactar
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
