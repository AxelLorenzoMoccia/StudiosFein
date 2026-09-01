import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

/**
 * GALERÍA POR CLIENTE
 * ---------------------
 * Se abre al tocar un logo/nombre clickeable en TrustedByMarquee.jsx —
 * "que el posible cliente vea el trabajo realizado para otro cliente"
 * (pedido explícito). Muestra todas las piezas que tenemos registradas
 * para esa marca en una grilla simple.
 *
 * Misma base de accesibilidad de modal que PortfolioLightbox.jsx:
 * `role="dialog"` + `aria-modal`, foco al botón de cerrar al abrir y
 * de vuelta al elemento que abrió al cerrar, Escape cierra, click en
 * el fondo cierra, scroll del body bloqueado mientras está abierto.
 */
export default function ClientGallery({ name, items, onClose }) {
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
      aria-label={`Trabajo realizado para ${name}`}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/80 px-6 py-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-stone bg-paper p-8 md:p-10"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper transition-colors duration-200 hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <X aria-hidden="true" />
        </button>

        <span className="text-xs font-light uppercase tracking-[0.2em] text-ink">Trabajo realizado</span>
        <h3 className="mt-1 text-2xl font-medium text-ink md:text-3xl">{name}</h3>
        <div className="mt-2 h-px w-8 bg-stone" aria-hidden="true" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <figure key={item.img} className="flex flex-col gap-2">
              <img src={item.img} alt={item.title} loading="lazy" className="w-full rounded-lg object-cover" />
              {item.title && (
                <figcaption className="text-sm font-light text-ink">{item.title}</figcaption>
              )}
            </figure>
          ))}
        </div>

        <a
          href="#contacto"
          onClick={onClose}
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Quiero algo así
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
