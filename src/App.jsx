import Header from './components/Header';
import IntroSection from './components/IntroSection';
import StatementSection from './components/StatementSection';
import MacbookSequenceSection from './components/MacbookSequenceSection';
import WeavyTransition from './components/WeavyTransition';
import ServicesSection from './components/ServicesSection';
import AIGallery from './components/AIGallery';
import TrustedByMarquee from './components/TrustedByMarquee';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <main className="bg-fein-dark">
      {/* Nav fija — se auto-invierte según la sección (ver Header.jsx) */}
      <Header />

      {/* 1. Intro — logo Fein + tagline, fade + zoom in */}
      <IntroSection />

      {/* 2. Manifiesto — texto en foco que se revela al scrollear */}
      <StatementSection />

      {/* 3. Secuencia Macbook — canvas de imágenes pineado (o su
          fallback ilustrado, ver MacbookSequenceSection.jsx) */}
      <MacbookSequenceSection />

      {/* 4. Transición ola — revela los servicios */}
      <WeavyTransition />

      {/* 5. Qué hacemos — tarjetas de servicios */}
      <ServicesSection />

      {/* 6. Galería IA — grid con fade-up/stagger + foto flotante */}
      <AIGallery />

      {/* 7. Quienes confiaron en nosotros — tren de logos infinito */}
      <TrustedByMarquee />

      {/* 8. Contacto — cierre del sitio */}
      <ContactSection />

      <Footer />
    </main>
  );
}
