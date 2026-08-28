import IntroSection from './components/IntroSection';
import MacbookSequenceSection from './components/MacbookSequenceSection';
import WeavyTransition from './components/WeavyTransition';
import AIGallery from './components/AIGallery';

export default function App() {
  return (
    <main className="bg-neutral-950">
      {/* 1. Intro — logo Fein, fade + zoom in */}
      <IntroSection />

      {/* 2. Secuencia Macbook — canvas de imágenes pineado */}
      <MacbookSequenceSection />

      {/* 3. Transición ola — revela la galería */}
      <WeavyTransition />

      {/* 4. Galería IA — grid con fade-up/stagger + foto flotante */}
      <AIGallery />
    </main>
  );
}
