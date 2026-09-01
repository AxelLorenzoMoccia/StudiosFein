import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

/**
 * LIGHTBOX DE UNA PIEZA
 * -----------------------
 * La misma foto más grande, con su copy completo y un único CTA de
 * contacto. Accesibilidad de modal, lo mínimo indispensable pero
 * completo:
 * - `role="dialog"` + `aria-modal="true"` + `aria-label` con el
 *   nombre de la pieza.
 * - Foco se mueve al botón de cerrar al abrir, y vuelve al elemento
 *   que lo abrió al cerrar.
 * - Escape cierra, click en el fondo (no en la tarjeta) cierra.
 * - Scroll del body bloqueado mientras está abierto.
 *
 * `gsap` directo, no `useGSAP()`: sin scroll ni selectores de texto de
 * por medio, un tween único sobre un ref concreto en cada apertura.
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

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/80 px-6 py-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-stone bg-paper md:flex-row"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper transition-colors duration-200 hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          <X aria-hidden="true" />
        </button>

        <img src={item.img} alt={item.title} className="h-64 w-full object-cover grayscale md:h-auto md:w-1/2" />

        <div className="flex flex-col justify-center gap-3 p-8 md:w-1/2">
          <span className="text-xs font-light uppercase tracking-wide text-ink">{item.tag}</span>
          <h3 className="text-2xl font-medium text-ink">{item.title}</h3>
          <div className="h-px w-8 bg-stone" aria-hidden="true" />
          {item.desc && <p className="font-light leading-relaxed text-ink">{item.desc}</p>}

          <a
            href="#contacto"
            onClick={onClose}
            className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
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
