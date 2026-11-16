/* =========================================================================
   evergaster · portafolio
   JavaScript mínimo: tema, filtro con View Transitions y fichas nativas.
   ========================================================================= */

const raiz = document.documentElement;
const btnTema = document.getElementById('tema');
const CLAVE_TEMA = 'tema';

/* ------------------------------------------------------------------ tema */
function temaActivo() {
  if (raiz.dataset.theme) return raiz.dataset.theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function rotularTema() {
  const siguiente = temaActivo() === 'dark' ? 'claro' : 'oscuro';
  btnTema.setAttribute('aria-label', `Cambiar a tema ${siguiente}`);
}

btnTema.addEventListener('click', () => {
  const nuevo = temaActivo() === 'dark' ? 'light' : 'dark';
  raiz.dataset.theme = nuevo;
  try { localStorage.setItem(CLAVE_TEMA, nuevo); } catch { /* modo privado */ }
  rotularTema();
});

// Si el sistema cambia de esquema y no hay preferencia guardada, la página ya
// reacciona por CSS; solo hay que actualizar la etiqueta del botón.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  try { if (!localStorage.getItem(CLAVE_TEMA)) rotularTema(); } catch { rotularTema(); }
});

rotularTema();

/* --------------------------------------------------------------- filtros */
const chips = [...document.querySelectorAll('.chip')];
const tarjetas = [...document.querySelectorAll('.tarjeta')];
const estado = document.getElementById('filtros-estado');

function textoEstado(n) {
  return `${n} ${n === 1 ? 'proyecto visible' : 'proyectos visibles'}`;
}

function aplicarFiltro(filtro, activo) {
  let visibles = 0;
  for (const t of tarjetas) {
    const coincide = filtro === 'todos' || t.dataset.cat === filtro;
    t.hidden = !coincide;
    if (coincide) visibles++;
  }
  for (const c of chips) {
    c.setAttribute('aria-pressed', String(c === activo));
  }
  estado.textContent = textoEstado(visibles);
}

for (const chip of chips) {
  chip.addEventListener('click', () => {
    const filtro = chip.dataset.filtro;
    // La transición de vista anima el reacomodo de la rejilla; sin soporte,
    // el cambio se aplica de inmediato.
    if (!document.startViewTransition) {
      aplicarFiltro(filtro, chip);
      return;
    }
    document.startViewTransition(() => aplicarFiltro(filtro, chip));
  });
}

/* ----------------------------------------------------------------- fichas */
const ficha = document.getElementById('ficha');
const contenido = document.getElementById('ficha-contenido');
const kicker = document.getElementById('ficha-kicker');

function abrirFicha(id) {
  const plantilla = document.getElementById('ficha-' + id);
  if (!plantilla) return;

  contenido.replaceChildren(plantilla.content.cloneNode(true));
  const titulo = contenido.querySelector('h2');
  if (titulo) titulo.id = 'ficha-titulo';
  const tipo = contenido.querySelector('.ficha-tipo');
  kicker.textContent = tipo ? tipo.textContent.split('·')[0].trim() : 'Ficha';

  ficha.showModal();
  contenido.scrollTop = 0;
}

for (const boton of document.querySelectorAll('.mas')) {
  boton.addEventListener('click', () => abrirFicha(boton.dataset.project));
}

// Cerrar deja el contenido vacío para no dejar una ficha muerta en el DOM.
ficha.addEventListener('close', () => {
  ficha.returnValue = '';
  contenido.replaceChildren();
});

// Respaldo de "light dismiss" donde no existe closedby (Safari todavía no).
// Se exige pulsar y soltar fuera, para que una selección de texto que termina
// en el fondo no cierre la ficha.
if (!('closedBy' in HTMLDialogElement.prototype)) {
  const fuera = (e, d) => {
    const r = d.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  let pulsadoFuera = false;
  ficha.addEventListener('pointerdown', (e) => { pulsadoFuera = fuera(e, ficha); });
  ficha.addEventListener('pointerup', (e) => {
    if (pulsadoFuera && fuera(e, ficha)) ficha.close();
    pulsadoFuera = false;
  });
}
