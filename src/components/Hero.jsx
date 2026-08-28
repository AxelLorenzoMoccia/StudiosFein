import { useGSAP } from '../hooks/useGSAP';

/**
 * Sección de apertura, a pantalla completa.
 * Animación de entrada simple con GSAP (sin scroll) a modo de ejemplo:
 * al montar, el título y el subtítulo hacen fade + slide-up escalonado.
 */
export default function Hero() {
  const scope = useGSAP((gsap) => {
    gsap
      .timeline({ defaults: { ease: 'power3.out', duration: 1 } })
      .from('[data-hero-title]', { opacity: 0, y: 40 })
      .from('[data-hero-subtitle]', { opacity: 0, y: 24 }, '-=0.6');
  });

  return (
    <section
      ref={scope}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 text-center text-white"
    >
      <h1
        data-hero-title
        className="px-6 text-5xl font-semibold tracking-tight md:text-7xl"
      >
        Fein
      </h1>
      <p
        data-hero-subtitle
        className="mt-4 max-w-xl px-6 text-lg text-neutral-400 md:text-xl"
      >
        Diseño con intención. Scrolleá para descubrir.
      </p>
    </section>
  );
}
