import ImageSequenceViewer from './components/ImageSequenceViewer';

const TEST_FRAME_COUNT = 24;
const testFrames = Array.from({ length: TEST_FRAME_COUNT }, (_, i) => {
  const hue = Math.round((i / (TEST_FRAME_COUNT - 1)) * 300);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='hsl(${hue},70%,50%)'/><text x='50%' y='50%' font-size='160' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif'>${i + 1}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
});

export default function App() {
  return (
    <main>
      <section className="flex h-screen items-center justify-center bg-white text-3xl text-black">
        ANTES del viewer (debe scrollear normal)
      </section>

      <ImageSequenceViewer frameUrls={testFrames} scrollLength={3} debug />

      <section className="flex h-screen items-center justify-center bg-white text-3xl text-black">
        DESPUÉS del viewer (debe scrollear normal)
      </section>
    </main>
  );
}
