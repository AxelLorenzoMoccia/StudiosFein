import { Shirt, Fingerprint, Package, Sparkles, Image as ImageIcon } from 'lucide-react';
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
    icon: Shirt,
    title: 'Estampas',
    text: 'Diseñamos piezas gráficas en máxima calidad, únicas para aplicar sobre prendas, combinando composición, tipografía, recursos visuales y una dirección estética coherente con la identidad de cada marca. Entregamos todos los diseños con mockups profesionales de alta calidad, en baja, media o alta complejidad.',
  },
  {
    icon: Fingerprint,
    title: 'Branding & Manual de marca',
    text: 'Desarrollamos una identidad visual sólida y coherente, definiendo cómo se presenta la marca en cada punto de contacto: sistema de logos, paleta de colores, tipografías, aplicaciones digitales, tarjetas, papelería, piezas de comunicación y guía de uso de marca.',
  },
  {
    icon: Package,
    title: 'Producto terminado',
    text: 'Nos encargamos de todo el proceso: conseguimos la prenda, desarrollamos los diseños y realizamos el estampado, cuidando cada detalle hasta obtener un producto final listo para comercializar. Vos solo te encargás de vender. Nosotros, del resto.',
  },
  {
    icon: Sparkles,
    title: 'Producción de fotos con IA',
    text: 'Creamos fotografías profesionales de producto con modelos generados por IA, cuidando iluminación, composición, escenarios y estética para desarrollar contenido visual de alto impacto, listo para redes, campañas y catálogos.',
  },
  {
    icon: ImageIcon,
    title: 'Mockups profesionales',
    text: 'Presentamos tus diseños en mockups de alta calidad, listos para utilizar en redes sociales, catálogos y material comercial, con una presentación cuidada y profesional.',
  },
];

function ServiceCard({ icon: Icon, title, text }) {
  return (
    <div data-service-card className="flex flex-col gap-4 p-8">
      <Icon className="h-6 w-6 text-ink" strokeWidth={1.25} aria-hidden="true" />
      <h3 className="text-xl font-medium text-ink">{title}</h3>
      <p className="font-light leading-relaxed text-ink">{text}</p>
    </div>
  );
}

/**
 * SERVICIOS — "qué hacemos"
 * ---------------------------
 * Fondo blanco liso (`bg-paper`), sin la textura/grano que tenía el
 * PDF original — pedido explícito. Fade-up + stagger simple al entrar
 * en viewport, mismo lenguaje del resto del sitio.
 */
export default function ServicesSection() {
  const scope = useGSAP((gsap, ScrollTrigger) => {
    gsap.set('[data-service-card]', { opacity: 0, y: 40 });

    ScrollTrigger.batch('[data-service-card]', {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
        }),
    });
  });

  return (
    <section ref={scope} className="w-full bg-paper px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-3 text-xs font-light uppercase tracking-[0.3em] text-ink">
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
            Servicios
            <span className="h-px w-8 bg-stone" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-medium text-ink md:text-5xl">Qué hacemos</h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-stone border border-stone sm:grid-cols-2 sm:divide-x lg:grid-cols-5">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
