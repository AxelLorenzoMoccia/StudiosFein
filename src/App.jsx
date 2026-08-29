import { useState } from 'react';
import Header from './components/Header';
import PageLoader from './components/PageLoader';
import CustomCursor from './components/CustomCursor';
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
  // El resto del sitio no se monta hasta que PageLoader termina — así
  // el timeline de entrada de IntroSection (que arranca solo, al
  // montarse) juega recién cuando el usuario puede verlo, no escondido
  // atrás de la pantalla de carga (si montara todo de una, esa
  // animación ya habría terminado por completo para cuando el loader
  // se corre, y el usuario se perdería el "foco" de las letras). Ver
  // el comentario largo en PageLoader.jsx para el resto del criterio.
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <PageLoader onDone={() => setIsLoading(false)} />;
  }

  return (
    <main className="bg-fein-light">
      {/* Cursor a medida — se auto-desactiva solo en touch/reduced-motion,
          ver CustomCursor.jsx */}
      <CustomCursor />

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
