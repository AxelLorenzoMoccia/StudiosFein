import Header from './components/Header';
import VideoHero from './components/VideoHero';
import ServicesSection from './components/ServicesSection';
import PortfolioCarousel from './components/PortfolioCarousel';
import TrustedByMarquee from './components/TrustedByMarquee';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

/**
 * PÁGINA — rediseño "limpio", pedido directo del dueño de la marca
 * ---------------------------------------------------------------
 * Versión anterior tenía intro animada, manifiesto de marca, secuencia
 * de la Macbook pineada (866 frames), transición de ola y una grilla
 * de servicios con copy inventado — todo eso se sacó a pedido
 * explícito: "tiene que ser LIMPIO TODO (...) volvé a lo básico (...)
 * menos es más". `ServicesSection` volvió a aparecer el 31 ago 2026,
 * pero reconstruida con el copy REAL del catálogo de servicios del
 * cliente (studiosfein.pdf) en vez del texto genérico anterior.
 *
 * Orden actual:
 *   1. VideoHero    — el video del cliente como portada, a pantalla
 *      completa y mapeado al scroll (no autoplay).
 *   2. ServicesSection — "qué hacemos", copy real del PDF del cliente.
 *   3. PortfolioCarousel — "piezas ya terminadas", simplificado.
 *   4. TrustedByMarquee  — "quienes confiaron en nosotros", clickeable
 *      donde hay trabajo real registrado (ver CLIENT_WORK ahí).
 *   5. ContactSection    — cierre, único CTA de contacto del sitio.
 *
 * También se sacaron el cursor a medida (explícitamente señalado como
 * "el mouse redondo que no sirve"), la barra de progreso de scroll, el
 * modo oscuro/ThemeToggle y el hover magnético de los botones — todo
 * en la misma dirección: menos piezas moviéndose, no más.
 */
export default function App() {
  return (
    <main className="bg-paper">
      {/* Único <h1> del sitio, para SEO/accesibilidad — visualmente no
          hace falta (el video ya abre con el wordmark), pero la página
          necesita un encabezado principal real, no solo un logo en el
          header. */}
      <h1 className="sr-only">StudiosFein — Estudio de diseño e identidad de marca</h1>

      <Header />
      <VideoHero />
      <ServicesSection />
      <PortfolioCarousel />
      <TrustedByMarquee />
      <ContactSection />
      <Footer />
    </main>
  );
}
