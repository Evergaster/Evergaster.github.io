# Portafolio — evergaster

Sitio estático de una sola página con once proyectos, contribuciones de código abierto y
método de trabajo. **No hay build, ni framework, ni dependencias**: tres archivos y una
carpeta de assets.

```
portafolio/
├── index.html          ← estructura, contenido y las 11 fichas (<template>)
├── styles.css          ← tokens, layout, componentes, overlay
├── app.js              ← tema, filtro con View Transitions, fichas nativas
├── assets/
│   ├── fonts/          ← Space Grotesk variable + Space Mono (OFL), subseteadas a WOFF
│   └── img/            ← capturas y renders reales en WebP
└── docs/               ← capturas del propio sitio (preview)
```

## Verlo

```bash
cd ~/Proyectos/portafolio
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

También abre con doble clic en `index.html`, pero servirlo por HTTP es lo correcto: las
fuentes y el preload se comportan igual que en producción.

## Dónde vive

Publicado con GitHub Pages desde `Evergaster/Evergaster.github.io`, servido en
**https://evergaster.uk** (dominio propio, declarado en `CNAME`). El repositorio publica
la raíz de `main`: al hacer push, Pages reconstruye en un par de minutos.

No hay rutas absolutas ni base URL: funciona igual en la raíz de un dominio o en un
subdirectorio.

## Añadir o editar un proyecto

1. Añadir la `<article class="tarjeta revelar" data-cat="…" data-project="id">` en `#rejilla`.
2. Añadir su `<template id="ficha-id">` al final del documento, antes del `<script>`.
3. Actualizar los contadores de los chips y "N proyectos visibles" si cambia el total.

Categorías válidas: `sistemas`, `apps`, `graficos`, `herramientas`.

Proyectos que están en el sitio: nd-shell, Umbriel Shaders, l2d-viewer, retro-smartbike,
Komorebi, hilo, openNothing, Poisson en Rust, plugins de Noctalia, startpage y carrito-compras. Cuatro proyectos se quedaron fuera por decisión del
autor; no se nombran porque son privados.

## Decisiones técnicas

- **Fichas con `<dialog>` nativo** (`showModal`), `aria-labelledby` apuntando al `h2` clonado,
  cierre por `closedby="any"` y respaldo por `pointerdown`/`pointerup` donde no existe
  `closedby`. El navegador hace el foco, el fondo inerte y el retorno de foco.
- **Filtro con `document.startViewTransition`**: si el navegador no lo tiene, el cambio se
  aplica sin animación; nunca se pierde funcionalidad.
- **Revelado al hacer scroll con animaciones CSS** (`animation-timeline: view()`), dentro de
  `@supports` y `prefers-reduced-motion: no-preference`. Es decorativo: sin soporte no hay
  respaldo en JS y no pasa nada.
- **Container queries** en las tarjetas y en la ficha (una o dos columnas según su propio
  ancho, no el de la ventana).
- **Fondo oscuro** `#0f0f10` (el patrón suma brillo, así que la base bajó un escalón).
- **Tema claro/oscuro** con `color-scheme` en la raíz y `light-dark()`, más un bloque de
  respaldo con `prefers-color-scheme` para navegadores viejos. El toggle escribe
  `data-theme` en `<html>` y guarda la preferencia; si no hay preferencia, manda el sistema.
- **`content-visibility: auto`** solo en las secciones que están bajo el pliegue, con
  `contain-intrinsic-size` para no mover el scroll.
- **Patrón de cruces del fondo**: un SVG en línea de 40×40 en `--cruz`, con dos versiones
  (clara/oscura) resueltas por `data-theme` y `prefers-color-scheme`. Cero peticiones extra.
  Son dos capas `fixed` con `z-index: -1` (el `body` lleva `isolation: isolate` para que
  queden sobre el fondo y debajo del contenido): una cercana de 40 px que avanza una celda
  cada 9 s y una lejana de 80 px, al 50 % de opacidad, que va en sentido contrario cada
  18 s. Las dos animan solo `transform`, así que corren en el compositor. Con
  `prefers-reduced-motion: reduce` no se anima nada.
- **Fuentes subseteadas** con `pyftsubset` a WOFF: 62 KB las dos en vez de 236 KB en TTF.
- **Imágenes WebP** de 19–59 KB, con `width`/`height` para no provocar CLS.

## Honestidad del contenido

Tres fichas sin captura (openNothing, Poisson y carrito) usan una **placa tipográfica** con
datos reales del proyecto o la salida de sus comandos. Las demás son capturas reales:
Komorebi se ejecutó con un HOME temporal y fondos de prueba generados con ffmpeg, y
retro-smartbike se compiló y corrió en un emulador Android (la captura es la pantalla de
entrada, porque el resto pide cuenta en la API). No son maquetas: es la terminal impresa. El resto son
capturas reales, y los pies de foto lo dicen cuando es un render de diseño y no una foto
del escritorio.

Las cifras (crates, líneas, pruebas) se midieron sobre el árbol el 2026-11-16:

```bash
find nothing_shell -name '*.rs' -not -path '*/target/*' | xargs cat | wc -l   # 13 491
find nothing_shell -name '*.rs' -not -path '*/target/*' | xargs grep -c '#\[test\]' | ...
```

## Pendiente

- Elegir host y publicar con URL real.
- Sustituir el render del diseño de nd-shell por una captura del shell corriendo.
- Enlaces a repositorios de los proyectos que hoy son solo locales.
- Repetir el render limpio de Hiyori con la CLI (el PNG viejo tenía los cuatro brazos).
