import Header from './components/Header';
import IntroSection from './components/IntroSection';
import StatementSection from './components/StatementSection';
import MacbookSequenceSection from './components/MacbookSequenceSection';
import WeavyTransition from './components/WeavyTransition';
import ServicesSection from './components/ServicesSection';
import TrustedByMarquee from './components/TrustedByMarquee';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// AIGallery.jsx ("Explorado con IA") queda sin usar acá a pedido del
// cliente — no aportaba claridad todavía. El componente y las 4
// imágenes generadas siguen en el repo por si se retoma más adelante;
// para reactivarla alcanza con importarla y agregar <AIGallery /> donde
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

      {/* 6. Quienes confiaron en nosotros — tren de logos infinito */}
      <TrustedByMarquee />

      {/* 7. Contacto — cierre del sitio */}
      <ContactSection />

      <Footer />
    </main>
  );
}
