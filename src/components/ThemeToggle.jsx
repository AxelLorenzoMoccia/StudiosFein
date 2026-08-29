import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useMagnetic } from '../hooks/useMagnetic';

const STORAGE_KEY = 'fein-theme';

/**
 * TOGGLE DE TEMA
 * ---------------
 * El sitio es claro por default (pedido explícito) — esto es la
 * opción para volver al oscuro original, no al revés. Vive en el
 * Header, al lado de "Hablemos".
 *
 * El estado real de la clase `dark` en <html> ya lo puso el script
 * bloqueante de index.html ANTES de que React montara nada (evita el
 * flash de tema equivocado) — este componente solo LEE ese estado
 * inicial una vez (`document.documentElement.classList.contains`) y
 * después lo maneja por su cuenta.
 *
 * `useMagnetic()`: mismo tratamiento que el link "Hablemos" de al
 * lado — es uno de los pocos elementos del header con ese detalle.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const magneticRef = useMagnetic();

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // localStorage puede fallar (modo privado estricto) — el toggle
      // visual igual funciona, solo no se recuerda entre visitas.
    }
  };

  return (
    <button
      ref={magneticRef}
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
