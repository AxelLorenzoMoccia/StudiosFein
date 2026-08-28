import { useGSAP } from '../hooks/useGSAP';

/**
 * 3. TRANSICIÓN "OLA"
 * --------------------
 * Cierra la secuencia de la Macbook con una cortina de borde ondulado
 * que sube y "traga" la pantalla a medida que esta sección entra en
 * foco, revelando la Galería IA debajo.
 *
 * No usamos MorphSVGPlugin (es un plugin pago del club de GSAP) —
 * en su lugar, un mismo path de ola se repite 2 veces lado a lado
 * (`w-[200%]`) y loopea horizontalmente infinito para que la cresta
 * se sienta viva, mientras un `yPercent` separado, atado al scroll,
 * hace subir toda la cortina. 100% gratis, sin plugins extra.
 *
 * Si más adelante el equipo de diseño provee un SVG de ola/forma
 * propia, basta con reemplazar el <path> de abajo por el suyo
 * (ajustando el viewBox si hace falta).
 */
export default function WeavyTransition() {
  const scope = useGSAP((gsap) => {
    // Arranca totalmente abajo, fuera de pantalla.
    gsap.set('[data-wave-curtain]', { yPercent: 100 });

    // Sube y cubre la pantalla en sincronía con el scroll de esta sección.
    gsap.to('[data-wave-curtain]', {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-wave-curtain]',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    });

    // Movimiento infinito y sutil de la cresta, independiente del
    // scroll, para que la ola se sienta "viva" y no una imagen fija.
    gsap.to('[data-wave-crest]', {
      xPercent: -50,
      duration: 10,
      ease: 'none',
      repeat: -1,
    });
  });

  return (
    <section ref={scope} className="relative h-[70vh] w-full overflow-hidden bg-fein-dark">
      <div data-wave-curtain className="absolute inset-0">
        {/* Cresta ondulada: el mismo path repetido x2 en ancho para loopear sin cortes */}
        <svg
          data-wave-crest
          viewBox="0 0 2400 200"
          preserveAspectRatio="none"
          className="absolute -top-px left-0 h-20 w-[200%]"
        >
          <path
            d="M0,100 C150,180 350,20 600,100 C850,180 1050,20 1200,100
               C1350,180 1550,20 1800,100 C1950,180 2150,20 2400,100
               L2400,200 L0,200 Z"
            className="fill-neutral-50"
          />
        </svg>

        {/* Cuerpo sólido de la cortina — mismo color que el fondo de la Galería */}
        <div className="absolute inset-x-0 bottom-0 top-20 bg-neutral-50" />
      </div>
    </section>
  );
}
