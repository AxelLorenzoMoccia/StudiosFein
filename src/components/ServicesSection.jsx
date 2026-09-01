import { useGSAP } from '../hooks/useGSAP';

/**
 * Copy real, sacado del catálogo de servicios del cliente
 * (studiosfein.pdf, sección "Servicios Disponibles") — no inventado,
 * solo prolijado (el PDF tenía algún typo suelto, ej. "tdos") y
 * recortado donde el original repetía cosas para el formato slide.
 * Pedido explícito: "agarra este pdf e incluile lo que tiene (...)
 * pero con el fondo blanco liso" — mismo contenido, mismo orden que
 * el catálogo, sobre `bg-paper` en vez del fondo gris con textura que
 * tenía el PDF.
 */
const SERVICES = [
  {
    title: 'Estampas',
    text: 'Diseñamos piezas gráficas en máxima calidad, únicas para aplicar sobre prendas, combinando composición, tipografía, recursos visuales y una dirección estética coherente con la identidad de cada marca. Entregamos todos los diseños con mockups profesionales de alta calidad, en baja, media o alta complejidad.',
  },
  {
    title: 'Branding & Manual de marca',
    text: 'Desarrollamos una identidad visual sólida y coherente, definiendo cómo se presenta la marca en cada punto de contacto: sistema de logos, paleta de colores, tipografías, aplicaciones digitales, tarjetas, papelería, piezas de comunicación y guía de uso de marca.',
  },
  {
    title: 'Producto terminado',
    text: 'Nos encargamos de todo el proceso: conseguimos la prenda, desarrollamos los diseños y realizamos el estampado, cuidando cada detalle hasta obtener un producto final listo para comercializar. Vos solo te encargás de vender. Nosotros, del resto.',
  },
  {
    title: 'Producción de fotos con IA',
    text: 'Creamos fotografías profesionales de producto con modelos generados por IA, cuidando iluminación, composición, escenarios y estética para desarrollar contenido visual de alto impacto, listo para redes, campañas y catálogos.',
  },
  {
    title: 'Mockups profesionales',
    text: 'Presentamos tus diseños en mockups de alta calidad, listos para utilizar en redes sociales, catálogos y material comercial, con una presentación cuidada y profesional.',
  },
];

/**
 * Fila de servicio — lista editorial, no tarjeta.
 * ---------------------------------------------------
 * Antes cada servicio vivía en una celda de una grilla de 5 columnas
 * con borde completo + divisores en las dos direcciones (`border` +
 * `divide-x`/`divide-y`) — con párrafos largos metidos en columnas
 * angostas, leía como una diapositiva de slide, no como un sitio (el
 * feedback textual: "parece un power point"). Acá cada fila es un
 * bloque de ancho completo con una sola línea fina arriba (no una caja
 * cerrada) — número grande + título a la izquierda, párrafo a la
 * derecha con su propio ancho acotado (`max-w-xl`, dentro del rango de
 * 65-75 caracteres por línea de DESIGN.md §3) — el mismo lenguaje que
 * usan los estudios de diseño/moda de referencia (Bureau, Pentagram,
 * Working Format): la tipografía hace todo el trabajo, ninguna caja
 * decorativa alrededor.
 */
function ServiceRow({ index, title, text }) {
  return (
    <div
      data-service-card
      className="group grid grid-cols-1 gap-3 border-t border-stone py-10 sm:grid-cols-12 sm:gap-8 md:py-12"
    >
      <div className="flex items-baseline gap-4 sm:col-span-4">
        {/* `ink` sólido, no `ash`: el número es texto chico (14px, no
            llega a "texto grande" de WCAG) y `ash` da 3.35:1 contra
            `paper` — por debajo del 4.5:1 mínimo (ver la nota de
            DESIGN.md §0.1 sobre este mismo problema en
            TrustedByMarquee.jsx, donde `ash` SÍ se usa pero recién en
            texto ≥24px). La jerarquía "número secundario, no
            protagonista" se logra con el peso (`font-light` vs el
            `font-medium` del título), no aclarando/transparentando el
            color. */}
        <span className="font-light text-sm tracking-wide text-ink">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-medium text-ink md:text-2xl">
          {title}
          {/* Subrayado que crece con el hover — mismo idioma que
              "Hablemos" en Header.jsx/ContactSection.jsx (transform
              puro, `scaleX` con `transform-origin` a la izquierda, no
              `width` — regla dura de DESIGN.md §4.5). */}
          <span
            aria-hidden="true"
            className="mt-1 block h-px w-full origin-left scale-x-0 bg-stone transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
        </h3>
      </div>

      <p className="max-w-xl font-light leading-relaxed text-ink sm:col-span-7 sm:col-start-6">{text}</p>
    </div>
  );
}

/**
 * SERVICIOS — "qué hacemos"
 * ---------------------------
 * Fondo blanco liso (`bg-paper`), sin la textura/grano que tenía el
 * PDF original — pedido explícito. Fade-up + stagger simple al entrar
 * en viewport, mismo lenguaje del resto del sitio — `feinOut` en vez
 * del `power2.out` genérico que tenía antes (DESIGN.md §4.3: preferir
 * las curvas custom del sitio salvo motivo puntual, y acá no lo hay).
 */
export default function ServicesSection() {
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-service-card]', { opacity: 0, y: 32 });

    ScrollTrigger.batch('[data-service-card]', {
      start: 'top 88%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'feinOut',
          stagger: 0.1,
          overwrite: true,
        }),
    });
  });

  return (
    <section ref={scope} className="w-full bg-paper px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-light uppercase tracking-[0.3em] text-ink">
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
            Servicios
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-medium text-ink md:text-5xl">Qué hacemos</h2>
        </div>

        {/* Sin `border`/`divide-*`: la única línea es el `border-t` de
            cada fila (ver ServiceRow), y la última fila cierra con su
            propio borde inferior para que la lista no quede "abierta"
            en el aire. */}
        <div className="border-b border-stone">
          {SERVICES.map((service, index) => (
            <ServiceRow key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
