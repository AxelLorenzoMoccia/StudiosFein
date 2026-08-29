import Header from './components/Header';
import IntroSection from './components/IntroSection';
import StatementSection from './components/StatementSection';
import MacbookSequenceSection from './components/MacbookSequenceSection';
import WeavyTransition from './components/WeavyTransition';
import ServicesSection from './components/ServicesSection';
import PortfolioCarousel from './components/PortfolioCarousel';
import TrustedByMarquee from './components/TrustedByMarquee';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// AIGallery.jsx ("Explorado con IA") queda sin usar acá a pedido del
// cliente — no aportaba claridad todavía como grilla. Sus 4 imágenes
// (src/assets/gallery/) sí se reusan más abajo en PortfolioCarousel,
// que las muestra en un formato distinto. El componente AIGallery en
// sí sigue en el repo por si se retoma la grilla más adelante; para
// reactivarlo alcanza con importarlo y agregar <AIGallery /> donde
// corresponda, no hace falta rehacer nada.

export default function App() {
  return (
    <main className="bg-fein-dark">
      {/* Nav fija — se auto-invierte según la sección (ver Header.jsx) */}
      <Header />

      {/* 1. Intro — logo Fein + tagline, fade + zoom in */}
      <IntroSection />

      {/* 2. Manifiesto de marca */}
      <StatementSection />

      {/* 3. Secuencia Macbook — canvas de imágenes pineado (o su
          fallback ilustrado, ver MacbookSequenceSection.jsx) */}
      <MacbookSequenceSection />

      {/* 4. Transición ola — revela los servicios */}
      <WeavyTransition />

      {/* 5. Qué hacemos — tarjetas de servicios */}
      <ServicesSection />

      {/* 6. Piezas ya hechas — carrusel 3D "coverflow" */}
      <PortfolioCarousel />

      {/* 7. Quienes confiaron en nosotros — tren de logos infinito */}
      <TrustedByMarquee />

      {/* 8. Contacto — cierre del sitio */}
      <ContactSection />

      <Footer />
    </main>
  );
}
