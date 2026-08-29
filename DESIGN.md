# Cerebro de diseñador — Fein

> Este archivo dicta cómo tomo decisiones visuales, tipográficas, de layout y de
> animación en este proyecto. Se carga solo en cada sesión (vía `@DESIGN.md` en
> [CLAUDE.md](CLAUDE.md)) — no hace falta pedirlo cada vez.
>
> Síntesis de tres fuentes:
> 1. Las guías de diseño filtradas en el repo público
>    [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks/tree/main/Anthropic/claude-design)
>    — el prompt principal (`claude-design.md`) y las sub-skills de ese mismo
>    producto interno de Anthropic (`frontend-design`, `hi-fi-design`,
>    `create-design-system`) que tienen contenido genérico aprovechable.
>    **Importante:** esto NO son skills instalables — son prompts internos
>    filtrados, sin paquete `SKILL.md` instalable ni instalador oficial. Lo que
>    hice fue leerlos y quedarme con lo transferible a un sitio React real,
>    descartando todo lo específico de su herramienta interna de "Design
>    Components" (`.dc.html`, exports a PDF/PPTX, `deck_stage`, etc. — no
>    existen en este proyecto). Ese conocimiento ya extraído vive acá abajo;
>    no hay nada más que "instalar" de esa fuente.
> 2. La skill `ui-ux-pro-max` (checklist de UX/accesibilidad/performance con
>    dataset propio buscable) — esta sí es un paquete de skill real, instalado
>    en `.claude/skills/ui-ux-pro-max/`.
> 3. Las skills de Emil Kowalski — `emil-design-eng`, `apple-design`,
>    `animation-vocabulary` (filosofía de motion, framework de decisión,
>    fluidez estilo Apple) — paquetes de skill reales, instalados en
>    `.claude/skills/` (symlinks a `.agents/skills/`).
>
> Más las lecciones que ya sacamos de este mismo repo (marcadas 🔧), que ninguna
> skill genérica sabe porque son nuestras.
>
> **Sobre "tener esto en las dos máquinas":** las skills (#2 y #3) son
> instalaciones locales por máquina y no viajan por git (ver `.gitignore` y
> §9 más abajo) — hay que reinstalarlas en cada compu nueva. Pero el
> conocimiento de las tres fuentes, ya destilado, vive en este archivo, que
> **sí** está en git — con hacer `git pull` alcanza para tenerlo disponible en
> cualquier máquina, sin reinstalar nada.

## 0. Cómo usar esto

- Esto es un resumen accionable, no un reemplazo de las skills instaladas
  (`.claude/skills/`). Cuando haga falta más profundidad, ir a la fuente:
  - Sistema de diseño completo para una página nueva → correr
    `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`
  - Nombre exacto de un efecto de motion → skill `animation-vocabulary`
  - Springs, gestos, drag, translucencia → skill `apple-design` completa
  - Filosofía de cuándo/por qué animar algo → skill `emil-design-eng` completa
- Las reglas de acá abajo no se re-litigan por página — son la base. Lo que
  varía por sección (copy, layout específico) se decide en el momento, pero
  respetando estos tokens y este framework.

## 1. Principios

1. **El detalle invisible es lo que se nota en conjunto.** Nadie va a señalar
   conscientemente el easing del reveal del titular, pero la suma de docenas de
   detalles bien resueltos es lo que hace que un sitio "se sienta" premium en
   vez de genérico. (Emil Kowalski)
2. **La belleza es una ventaja competitiva, no un lujo.** En un mundo donde
   todo el software "funciona", el gusto es lo que diferencia.
3. **Comprometerse con una dirección, no dejarla en el aire.** Si no hay
   sistema de diseño explícito, definir tono/paleta/mood antes de construir —
   no adivinar ni tirar de opciones genéricas "por si acaso".
4. **Menos, pero con intención.** Errar del lado del espacio en blanco. Agregar
   solo lo que se pidió — una sección que "se siente vacía" es señal de un
   problema de layout, no una invitación a rellenarla con contenido de relleno.
5. **Craft = decisiones defendibles.** Todo espaciado, timing y alineación
   tiene que poder justificarse. "Porque sí" no es una respuesta válida.
6. **Evitar clichés de "hecho por IA":** gradientes agresivos sin motivo,
   tarjetas con borde-izquierdo-de-color genérico, exceso de emojis como
   iconos, tipografías sobreusadas por default (Inter, Roboto, Arial,
   Fraunces) sin que sea una decisión consciente.
   - ⚠️ Fein **ya eligió Inter a propósito** (ver comentario en
     [index.html](index.html): se probó mezclar con un serif itálico y no
     convenció). Esto no es una regla para revertir esa decisión — es una
     alerta para la *próxima* vez que se elija tipografía desde cero: no caer
     en el default por default.
7. **Buscar el elemento memorable.** En cada pieza nueva, identificar cuál va
   a ser el detalle o momento que la gente recuerde (acá: la secuencia
   Macbook pineada, la ola de transición) — y ejecutarlo con precisión, en
   vez de repartir el esfuerzo parejo entre diez micro-detalles anónimos.
8. **Fundamentar en lo que ya existe, no arrancar de cero.** Antes de diseñar
   algo nuevo, mirar los componentes/tokens ya construidos en este repo (§2) y
   partir de ahí. Si falta un asset real (ícono, foto, logo), usar un
   placeholder honesto y señalado con un comentario `TODO` — nunca
   inventar/recrear de memoria un logo o asset de marca que no fue provisto
   (ya es el patrón en `AIGallery.jsx` y `MacbookSequenceSection.jsx`,
   mantenerlo).
9. **Todo video/frame generado por IA se revisa entero antes de integrarlo —
   sin excepción.** 🔧 Ya pasó tres veces en este mismo repo (dos videos +
   un lote de frames de Google Flow, todos para la secuencia Macbook): un
   generador de video alucina logos de marcas reales — Apple, Nike, Patagonia,
   Vans, Spotify, Tame Impala, React, HUF aparecieron todos juntos y
   perfectamente legibles en un solo shot — o la interfaz de una app de
   terceros con su propio ícono, no un placeholder gris. Antes de usar
   cualquier frame/video generado por IA en el sitio:
   - Mirar el primero, uno de la mitad y el último **como mínimo** — si el
     material tiene varios "shots" distintos (ej. tapa cerrada → se abre →
     pantalla), revisar al menos uno de cada segmento, no solo los extremos.
     Acá mismo (frames de Google Flow) el problema estaba en el primer y
     último segmento; el del medio salió limpio.
   - Buscar específicamente: logos reconocibles (aunque sea un logo genuino
     de Apple en la tapa de la laptop), UI de una app real (no una inventada
     por la IA con texto ilegible), texto de marca legible aunque sea de una
     marca chica.
   - Si aparece una marca de terceros, **no se usa ese segmento** — ni tapando
     el logo con un parche cosmético. Cubrir un logo entre varios no resuelve
     los demás, y el resultado sigue sin ser un asset propio de Fein.
   - Al pedirle a la herramienta de generación (Google Flow, Veo, Sora, etc.)
     que regenere: ser explícito en el prompt — "sin logos ni marcas reales
     de ningún tipo", "stickers en blanco o con formas/colores genéricos, sin
     texto ni logos", "pantalla de laptop mostrando una interfaz genérica sin
     texto legible". Los modelos de video alucinan marcas reales por defecto
     cuando el concepto es genérico ("laptop con stickers") porque así es su
     data de entrenamiento — hay que restringirlo a propósito.

## 2. Sistema visual de Fein (tokens ya decididos — no reinventar por página)

| Token | Valor | Dónde |
|---|---|---|
| Fondo oscuro de marca | `.bg-fein-dark` — no es negro plano, tiene 2 gradientes radiales sutiles + grano SVG (`feTurbulence`) | [index.css](src/index.css) |
| Fondo claro de contraste | `bg-neutral-50` | secciones tipo Servicios/Galería |
| Acento | `accent` `#b08b4f` / `accent-light` `#d4b876` (dorado apagado) | [tailwind.config.js](tailwind.config.js) |
| Tipografía | Inter, una sola familia para todo el sitio | — |
| Easings custom | `feinOut` `cubic-bezier(0.23,1,0.32,1)`, `feinInOut` `cubic-bezier(0.77,0,0.175,1)` | [useGSAP.js](src/hooks/useGSAP.js) |

Reglas que se desprenden de esta tabla:

- **Un solo acento.** Nunca sumar un segundo color "de marca" compitiendo con
  el dorado — si hace falta más color, variar luminosidad/opacidad del mismo
  hue, no el hue en sí (regla oklch de la guía de Claude Design: 0–2 acentos,
  mismo croma/luminosidad, solo varía el matiz si hay más de uno).
- **Fondos "casi neutros", no saturados.** Blancos y negros con máximo de
  saturación muy bajo (por eso el fondo oscuro tiene grano en vez de ser un
  `#000000` plano — un negro plano en pantallas grandes se ve chato).
- **Atmósfera en capas, no color sólido a secas.** `.bg-fein-dark` ya combina
  2 gradientes radiales + grano — ese es el patrón a seguir para cualquier
  fondo grande nuevo (glow, textura, gradiente sutil), en vez de un color
  plano. Ya se usó también en el glow del manifiesto (`StatementSection`).
- **1–3 tipografías como techo absoluto**, hoy usamos 1. No sumar una segunda
  familia sin una razón tipográfica concreta (ya se probó y se descartó un
  serif itálico para el manifiesto — no reabrir esa decisión sin pedido
  explícito).
- **Espaciado con `gap`, no márgenes entre hermanos.** `flex`/`grid` + `gap-*`
  para separar elementos en una fila/columna — el margen individual por ítem
  se rompe fácil al reordenar o insertar contenido.
- **`text-balance` / `text-pretty` en titulares.** Ya en uso (`StatementSection`)
  — mantenerlo en cualquier titular corto nuevo para que el wrap no deje una
  palabra sola en la última línea.
- **Contenedor con max-width consistente en desktop** (`max-w-4xl`/`5xl`/`6xl`
  según la sección) — no anchos arbitrarios por página.

## 3. Tipografía (jerarquía real, no solo tamaño)

- **Tracking depende del tamaño, nunca un valor fijo global.** Titulares
  grandes (`text-5xl`+) quieren tracking *negativo* (`tracking-tight` o
  `-0.02em`); texto de cuerpo se queda cerca de `0`; los eyebrows en mayúscula
  (`MANIFIESTO`, `SERVICIOS`) usan tracking bien *positivo* (`tracking-[0.3em]`
  o más) — ya es el patrón en uso, mantenerlo.
- **Line-height inverso al tamaño**: ajustado en titulares (`leading-tight`),
  más suelto en párrafos (`leading-relaxed`, 1.5–1.75).
- **La jerarquía la arma el trío peso + tamaño + line-height juntos**, no el
  tamaño solo. Un eyebrow pequeño en `font-medium` + mayúsculas + tracking
  amplio puede pesar visualmente tanto como un h3 sin serlo tipográficamente.
- **Mínimos de legibilidad**: 16px de base en body/mobile (evita el auto-zoom
  de iOS en inputs), nunca texto de cuerpo bajo 12px.
- **65–75 caracteres por línea en desktop, 35–60 en mobile** para párrafos
  largos — si una sección de texto se ve como una pared, achicar el
  `max-w-*` del contenedor de texto, no bajar el tamaño de fuente.

## 4. Animación — el framework de decisión (antes de escribir código)

Cuatro preguntas, en orden, antes de animar cualquier cosa nueva:

### 4.1 ¿Debería animar esto siquiera?

| Frecuencia de uso | Decisión |
|---|---|
| Cientos de veces por sesión (atajos de teclado, toggles) | No animar. Nunca. |
| Docenas de veces (hover, focus) | Animación mínima o ninguna |
| Ocasional (reveals de sección, modales) | Animación estándar — **la mayoría de este sitio cae acá** |
| Rara / primera vez (intro, hero) | Ahí sí vale la pena invertir más — la Intro y la secuencia Macbook son las piezas "hero" del sitio |

Preferir **una secuencia de entrada bien orquestada** (staggers coordinados en
la pieza hero) por sobre repartir microinteracciones sueltas por todos lados
— concentrar el esfuerzo, no diluirlo.

### 4.2 ¿Cuál es el propósito?

Toda animación necesita una respuesta clara a "¿por qué se mueve esto?":
continuidad espacial, indicar un cambio de estado, explicar algo, dar feedback,
o evitar un cambio brusco. Si la única razón es "queda lindo" y el usuario lo
va a ver seguido, no animar.

### 4.3 ¿Qué easing?

- Entra o sale de pantalla → `feinOut` (ease-out con carácter, ya registrado)
- Se mueve/transforma estando en pantalla (scale, rotate en la secuencia
  Macbook) → `feinInOut`
- Motion continuo a velocidad constante (marquee, loop infinito como la ola o
  el floating de la galería) → `ease: 'none'` / linear
- **Nunca `ease-in` solo** para algo que entra — arranca lento justo cuando el
  usuario más lo está mirando, se siente pesado.
- Preferir estas dos curvas custom sobre `power2`/`power3` genéricos de GSAP
  salvo que haya un motivo puntual (ya se decidió así en `useGSAP.js`).

### 4.4 ¿Cuánto dura?

| Elemento | Duración |
|---|---|
| Feedback de press/hover | 100–160ms |
| Tooltips, popovers chicos | 125–200ms |
| Reveals de sección (fade-up, stagger) | 700–900ms, con `duration: 0.8` ya como default en el sitio |
| Timeline "hero" pineado (Intro, transición ola) | Puede ser más largo — está atado al scroll, no a un reloj |
| Salida | Más rápida que la entrada (~60–70% de la duración de entrada) |

### 4.5 Reglas duras, sin excepción

- **Solo animar `transform` y `opacity`.** Nunca `width`/`height`/`top`/`left`
  — fuerzan layout+paint en cada frame en vez de correr por GPU.
- **Nunca animar entrando desde `scale(0)`.** Nada en el mundo real aparece de
  la nada — arrancar desde `scale(0.9-0.95)` + opacity.
- **Stagger entre 30–80ms por ítem** (usamos ~120ms en algunos casos, está
  bien para grupos chicos de 2-5 ítems; para grillas más grandes bajar hacia
  el rango 30-50ms para que no se sienta lento).
- **Máximo 1-2 elementos protagonistas animando por vista** — no todo a la vez.
- **Respetar `prefers-reduced-motion`.** Reducir/quitar movimiento y parallax,
  pero mantener transiciones de opacity/color que ayudan a entender la
  interfaz. 🔧 Auditado: todo loop infinito puramente ambiente (no atado al
  scroll ni al mouse, no informa nada) se salta entero bajo esta preferencia
  en vez de solo bajarle la velocidad — los glows de IntroSection.jsx y
  StatementSection.jsx, la cresta de WeavyTransition.jsx, el floating de
  AIGallery.jsx, y el bob/sway de MacbookVideoScrub.jsx y
  MacbookOpenReveal.jsx. Se dejó sin tocar lo que SÍ está atado 1:1 a una
  acción del usuario (scroll o mouse), como ScrollProgress.jsx, el scrubbing
  de ImageSequenceViewer/MacbookVideoScrub/MacbookOpenReveal, o el glow que
  sigue al mouse en IntroSection — no son "movimiento autónomo", son
  respuesta directa a lo que el usuario ya está haciendo con su propia mano.
  Única excepción que se mantiene desacelerada en vez de apagada:
  TrustedByMarquee.jsx (un tren de logos inmóvil se lee como roto, a
  diferencia de un glow de fondo quieto).
- **Nunca bloquear el input durante una animación** — el usuario tiene que
  poder seguir scrolleando/clickeando mientras algo anima.

## 5. GSAP + ScrollTrigger — lecciones de este repo 🔧

Esto es conocimiento específico de Fein que ninguna skill genérica tiene,
sacado de bugs reales que ya pisamos (dos veces el mismo, dos componentes
distintos):

- **El elemento pineado no puede tener altura fija Y `overflow-hidden` a la
  vez, si necesitás que GSAP reserve espacio de scroll.** GSAP envuelve el
  elemento pineado en un `pin-spacer` que crece para reservar el scroll extra;
  si un ancestro tiene altura fija (`h-screen`) + `overflow-hidden`, ese
  spacer queda recortado y el pin nunca libera scroll real. Patrón correcto:
  separar en dos capas — un wrapper externo de altura automática (sin
  `overflow-hidden`), y adentro el elemento que se pinea con su propia altura
  fija. Si además necesitás recortar contenido que se escala/desborda (un
  zoom, por ejemplo), esa capa de clip va en un nivel intermedio, no en el
  wrapper externo. Ver `ImageSequenceViewer.jsx` e `IntroSection.jsx` (ambos
  tuvieron este bug, ambos ya corregidos).
- **`gsap.set()` + `gsap.to()` por separado puede dejar un residuo de
  transform bajo el doble-montaje de React StrictMode en dev** (el titular de
  `StatementSection` quedaba invisible por esto). Usar siempre
  `gsap.fromTo(target, {from}, {to, ...})` en una sola llamada atómica en vez
  de `set` + `to` separados.
- **Preload de imágenes: usar `img.decode()`, no solo `onload`.** `decode()`
  garantiza que el frame ya esté decodificado antes de dibujarlo — evita el
  "hitch" de decodificación al scrollear rápido por una secuencia de canvas
  (`ImageSequenceViewer.jsx`).
- **Cap de `devicePixelRatio` en 2** para el backing-store de cualquier
  `<canvas>` — en pantallas 3x/4x sin el cap, el costo de cada `drawImage` se
  dispara sin ganancia visual perceptible.
- **Todo ScrollTrigger se crea adentro de `useGSAP()`**, que ya envuelve la
  animación en `gsap.context()` + `ctx.revert()` en cleanup. No crear
  ScrollTriggers sueltos fuera de ese hook — se pierde el auto-cleanup y
  quedan triggers fantasma al navegar/desmontar.
- **Selectores dentro del callback de `useGSAP`:** si necesitás referenciar el
  elemento raíz de la sección como `trigger`, usá un selector de atributo
  (`'[data-mi-seccion]'`), no el ref (`scope.current`) — referenciar `scope`
  dentro de su propio callback de inicialización dispara un error de lint
  (`react-hooks/immutability`, variable usada antes de declararse) aunque
  funcione en runtime.
- **`end: '+=100%'` es relativo a la altura del propio trigger** (no del
  viewport globalmente, aunque en la práctica suele coincidir si el trigger
  mide `100vh`) — usarlo para "pinear una pantalla completa de scroll" es el
  patrón ya establecido en `IntroSection.jsx`.

## 6. UX / Accesibilidad / Performance — prioridades para un sitio marketing

(Resumen filtrado de `ui-ux-pro-max` — dropeados los ítems solo de apps
nativas móviles: haptics, safe-areas, bottom-nav, Dynamic Type.)

**Crítico — nunca negociable:**
- Contraste de texto ≥ 4.5:1 (normal) / 3:1 (texto grande) — verificar en
  ambos fondos (`bg-fein-dark` y `bg-neutral-50`) por separado, no asumir que
  un valor que funciona en uno funciona en el otro.
- Anillo de foco visible en todo elemento interactivo — nunca `outline: none`
  sin un reemplazo visible.
- Alt text descriptivo en imágenes con significado; `aria-hidden="true"` en
  las puramente decorativas (como los separadores `<span className="h-px">`
  que ya usamos junto a los eyebrows — revisar que tengan `aria-hidden`).
- Botones/links solo-ícono necesitan `aria-label`.
- Zoom nunca deshabilitado (`viewport` meta sin `user-scalable=no`).

**Alto:**
- Imágenes en WebP, `loading="lazy"` bajo el fold, dimensiones declaradas
  para evitar layout shift (CLS).
- Mobile-first: probar diseño en 375px antes que en desktop.
- Sin scroll horizontal en ningún breakpoint.
- Un solo CTA primario por vista — el resto, visualmente subordinado.

**Medio:**
- Tokens semánticos de color en vez de hex sueltos en cada componente — ya
  vía Tailwind config (`accent`, `fein-dark`), mantenerlo así para cualquier
  color nuevo.
- Formularios (cuando los haya, ej. `ContactSection`): label visible (no solo
  placeholder), error específico pegado al campo, feedback de envío
  (loading → success/error).

## 7. Voz y copy

- **El texto del usuario se respeta tal cual**, salvo pedido explícito de
  reescribirlo. Formatear y maquetar, no editorializar contenido ajeno.
- **Nada de relleno.** Si una sección se siente vacía, el problema es el
  layout, no falta de texto — no compensar con paja.
- **Evitar tics de escritura "de IA":** exceso de guiones largos, la
  estructura repetitiva "no es X, es Y", entusiasmo genérico sin sustancia
  ("¡una solución increíble!"), oraciones cortas encadenadas como recurso
  de estilo en vez de necesidad real.
- **Tono de marca ya establecido** (ver `StatementSection.jsx`): directo, con
  una idea fuerte por línea, en español rioplatense neutro, sin
  exclamaciones de venta. Frase ancla: *"No diseñamos para que se vea bien.
  Lo hacemos para que se sienta bien."* — cualquier copy nuevo debería poder
  convivir con esa frase sin desentonar.

## 8. Checklist antes de dar por terminada una sección nueva

- [ ] ¿Hay video/frames generados por IA nuevos? Revisados enteros — primero,
      mitad y último de cada segmento — buscando logos/marcas reales o UI de
      apps reales (§1.9, ya pasó tres veces).
- [ ] ¿El wrapper de cualquier elemento pineado tiene altura fija +
      `overflow-hidden` a la vez? (§5 — el bug que ya pisamos dos veces)
- [ ] ¿Las animaciones de entrada usan `fromTo` (no `set`+`to` separados)?
- [ ] ¿Solo se anima `transform`/`opacity`?
- [ ] ¿Se usó `feinOut`/`feinInOut` en vez de un ease genérico, salvo motivo
      puntual?
- [ ] ¿Contraste de texto verificado en el fondo real de la sección (oscuro
      o claro)?
- [ ] ¿Probado en 375px además de desktop?
- [ ] ¿Un solo acento de color, ninguno nuevo sin justificar?
- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Verificado en el navegador (no solo "compila") — screenshot o
      inspección de DOM/console cuando la pieza tiene animación de scroll.

## 9. Skills instaladas — cuándo ir a buscarlas

| Necesito... | Skill | Comando/uso |
|---|---|---|
| Sistema de diseño completo para una página nueva | `ui-ux-pro-max` | `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system` |
| Un ícono, paleta o tipografía puntual | `ui-ux-pro-max` | `--domain icons\|color\|typography` |
| Nombre exacto de un efecto de motion | `animation-vocabulary` | leer `SKILL.md` |
| Springs, drag, gestos, translucencia | `apple-design` | leer `SKILL.md` completo |
| Filosofía de cuándo animar / revisar animaciones existentes | `emil-design-eng`, `review-animations`, `improve-animations` | leer `SKILL.md` |
| Detectar dónde falta animación | `find-animation-opportunities` | leer `SKILL.md` |

Estas skills viven en `.claude/skills/` (algunas son symlinks a
`.agents/skills/`) — son locales a cada máquina, no viajan por git (ver
`.gitignore`). Si se clona el repo en una compu nueva, hay que reinstalarlas:

```bash
npm install -g ui-ux-pro-max-cli && uipro init --ai claude
npx skills@latest add emilkowalski/skills
```
