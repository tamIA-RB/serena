// ==========================================
// SERENA JOYERÍA — scriptt.js
// ==========================================

'use strict';

// ------------------------------------------
// ESTADO GLOBAL
// El catálogo se carga desde productos.json
// ------------------------------------------
let productos = [];
let carrito   = [];

// ------------------------------------------
// IMAGEN DE RESPALDO (SVG inline)
// ------------------------------------------
const IMAGEN_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='280' viewBox='0 0 300 280'%3E%3Crect width='300' height='280' fill='%23f5f3ef'/%3E%3Ctext x='50%25' y='45%25' font-family='Georgia,serif' font-size='28' fill='%23a3ad99' text-anchor='middle' dominant-baseline='middle' letter-spacing='4'%3ESERENA%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Georgia,serif' font-size='11' fill='%23c5a059' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'%3Ejoyería%3C/text%3E%3C/svg%3E";

// ------------------------------------------
// UTILIDADES DE FECHA — etiqueta NUEVO
// ------------------------------------------
function esNuevo(fechaSubida) {
  if (!fechaSubida) return false;
  const hoy     = new Date();
  const subida  = new Date(fechaSubida + 'T00:00:00');
  const diffDias = (hoy - subida) / (1000 * 60 * 60 * 24);
  return diffDias >= 0 && diffDias <= 7;
}

function estaAgotado(p) {
  return p.stock === 0 || p.estado === 'agotado';
}

// ------------------------------------------
// CARRITO
// ------------------------------------------
function totalItems() {
  return carrito.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
}

function totalPrecio() {
  return carrito.reduce(function (sum, item) { return sum + item.precio * item.cantidad; }, 0);
}

function agregarAlCarrito(nombre, precio) {
  const p = productos.find(function (x) { return x.nombre === nombre; });
  if (p && estaAgotado(p)) return;

  const existente = carrito.find(function (item) { return item.nombre === nombre; });
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarFeedbackBoton(nombre);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContadorCarrito();
  refrescarContenidoModal();
}

function limpiarCarrito() {
  carrito = [];
  actualizarContadorCarrito();
}

// ------------------------------------------
// UI — CONTADOR DEL CARRITO
// ------------------------------------------
function actualizarContadorCarrito() {
  const badge = document.getElementById('carrito-contador');
  if (!badge) return;
  const n = totalItems();
  badge.textContent = n;
  badge.style.display = n > 0 ? 'inline-block' : 'none';
  badge.style.transform = 'scale(1.4)';
  setTimeout(function () { badge.style.transform = 'scale(1)'; }, 200);
}

function mostrarFeedbackBoton(nombre) {
  document.querySelectorAll('.product-item').forEach(function (tarjeta) {
    const titulo = tarjeta.querySelector('h3');
    if (!titulo || titulo.textContent !== nombre) return;
    const btn = tarjeta.querySelector('.btn-agregar');
    if (!btn) return;
    btn.textContent = '✓ AGREGADO';
    btn.classList.add('btn-agregado');
    setTimeout(function () {
      btn.textContent = 'AGREGAR';
      btn.classList.remove('btn-agregado');
    }, 1400);
  });
}

// ------------------------------------------
// RENDERIZADO DE TARJETAS
// ------------------------------------------
function renderizarProductos(lista, contenedorId) {
  const grid = document.getElementById(contenedorId);
  if (!grid) return;
  grid.innerHTML = '';

  if (lista.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'grid-vacio';
    aviso.textContent = '— SIN PRODUCTOS EN ESTA CATEGORÍA —';
    grid.appendChild(aviso);
    return;
  }

  lista.forEach(function (p) {
    const agotado = estaAgotado(p);
    const nuevo   = !agotado && esNuevo(p.fechaSubida);

    // Tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-item' + (agotado ? ' product-item--agotado' : '');

    // Etiqueta AGOTADO o NUEVO (nunca las dos)
    if (agotado || nuevo) {
      const badge = document.createElement('span');
      badge.className = agotado
        ? 'product-badge product-badge--agotado'
        : 'product-badge product-badge--nuevo';
      badge.textContent = agotado ? 'AGOTADO' : 'NUEVO';
      tarjeta.appendChild(badge);
    }

    // Imagen
    const img = document.createElement('img');
    img.src     = p.imagen;
    img.alt     = p.nombre + ' – Serena Joyería Ecuador';
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      this.onerror = null;
      this.src = IMAGEN_PLACEHOLDER;
    });
    if (!agotado) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () { verDetalle(p.nombre); });
    }
    tarjeta.appendChild(img);

    // Detalles
    const detalles = document.createElement('div');
    detalles.className = 'product-details';

    const h3 = document.createElement('h3');
    h3.textContent = p.nombre;

    const precioEl = document.createElement('p');
    precioEl.className = 'product-price';
    precioEl.textContent = '$' + p.precio.toFixed(2);

    // Info de stock
    const stockEl = document.createElement('p');
    stockEl.className = 'product-stock';
    if (agotado) {
      stockEl.textContent = 'Sin disponibilidad';
      stockEl.classList.add('product-stock--agotado');
    } else if (p.stock <= 3) {
      stockEl.textContent = '¡Solo ' + p.stock + ' disponible' + (p.stock === 1 ? '' : 's') + '!';
      stockEl.classList.add('product-stock--urgente');
    } else {
      stockEl.textContent = p.stock + ' disponibles';
    }

    // Botón
    const btn = document.createElement('button');
    btn.className = 'btn-agregar';
    if (agotado) {
      btn.textContent = 'AGOTADO';
      btn.disabled    = true;
      btn.classList.add('btn-agregar--desactivado');
    } else {
      btn.textContent = 'AGREGAR';
      btn.addEventListener('click', function () {
        agregarAlCarrito(p.nombre, p.precio);
        abrirModalCarrito();
      });
    }

    detalles.appendChild(h3);
    detalles.appendChild(precioEl);
    detalles.appendChild(stockEl);
    detalles.appendChild(btn);
    tarjeta.appendChild(detalles);
    grid.appendChild(tarjeta);
  });
}

function cargarNuevasLlegadas(orden) {
  orden = orden || 'nuevos';
  let lista = productos.slice();

  if (orden === 'nuevos') {
    lista.sort(function (a, b) {
      return new Date(b.fechaSubida) - new Date(a.fechaSubida);
    });
  } else if (orden === 'precio-asc') {
    lista.sort(function (a, b) { return a.precio - b.precio; });
  } else if (orden === 'precio-desc') {
    lista.sort(function (a, b) { return b.precio - a.precio; });
  }

  renderizarProductos(lista, 'product-grid');
}

function cargarCategorias() {
  ['anillos', 'collares', 'aretes', 'gafas'].forEach(function (cat) {
    renderizarProductos(
      productos.filter(function (p) { return p.categoria === cat; }),
      'grid-' + cat
    );
  });
}

// ------------------------------------------
// MODAL — CARRITO
// ------------------------------------------
function abrirModalCarrito() {
  refrescarContenidoModal();
  abrirModal('modal-compra');
}

function refrescarContenidoModal() {
  const titulo = document.getElementById('modal-titulo');
  const texto  = document.getElementById('modal-texto');
  if (!titulo || !texto) return;

  const n = totalItems();
  titulo.textContent = n === 0 ? 'Tu carrito' : 'Tu carrito (' + n + ')';

  if (carrito.length === 0) {
    texto.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  carrito.forEach(function (item, index) {
    const fila = document.createElement('div');
    fila.className = 'carrito-fila';

    const label = document.createElement('span');
    label.className = 'carrito-fila__label';
    label.textContent = (item.cantidad > 1 ? item.cantidad + 'x ' : '') +
                        item.nombre + ' — $' + (item.precio * item.cantidad).toFixed(2);

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'carrito-fila__eliminar';
    btnEliminar.setAttribute('aria-label', 'Eliminar ' + item.nombre);
    btnEliminar.textContent = '✕';
    btnEliminar.addEventListener('click', function () { eliminarDelCarrito(index); });

    fila.appendChild(label);
    fila.appendChild(btnEliminar);
    fragment.appendChild(fila);
  });

  const total = document.createElement('p');
  total.className = 'carrito-total';
  total.textContent = 'Total: $' + totalPrecio().toFixed(2);
  fragment.appendChild(total);

  texto.innerHTML = '';
  texto.appendChild(fragment);
}

// ------------------------------------------
// MODAL — DETALLE
// ------------------------------------------
function verDetalle(nombre) {
  const p = productos.find(function (item) { return item.nombre === nombre; });
  if (!p || estaAgotado(p)) return;

  document.getElementById('det-img').src            = p.imagen;
  document.getElementById('det-img').alt            = p.nombre + ' – Serena Joyería';
  document.getElementById('det-nombre').textContent = p.nombre;
  document.getElementById('det-precio').textContent = '$' + p.precio.toFixed(2);
  document.getElementById('det-desc').textContent   =
    p.descripcion || 'Pieza artesanal única, diseñada con materiales de alta calidad y acabados elegantes. Ideal para resaltar tu estilo diario.';

  const btnAgregar = document.getElementById('det-btn-agregar');
  const btnNuevo   = btnAgregar.cloneNode(true);
  btnNuevo.addEventListener('click', function () {
    agregarAlCarrito(p.nombre, p.precio);
    cerrarDetalle();
    abrirModalCarrito();
  });
  btnAgregar.parentNode.replaceChild(btnNuevo, btnAgregar);

  abrirModal('modal-detalle');
}

// ------------------------------------------
// MODAL — HELPERS
// ------------------------------------------
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
  const modal = document.getElementById(id || 'modal-compra');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function cerrarDetalle() {
  cerrarModal('modal-detalle');
}

// ------------------------------------------
// BÚSQUEDA
// ------------------------------------------
function inicializarBusqueda() {
  const input = document.getElementById('input-busqueda');
  if (!input) return;

  const tituloGrid       = document.querySelector('#new-arrivals h2');
  const seccionesCat     = document.querySelectorAll('.category-section');
  const bannerIntermedio = document.querySelector('.mid-banner');

  input.addEventListener('input', function () {
    const termino = this.value.trim().toLowerCase();

    if (termino === '') {
      if (tituloGrid)       tituloGrid.textContent = 'NUEVAS LLEGADAS';
      seccionesCat.forEach(function (s) { s.hidden = false; });
      if (bannerIntermedio) bannerIntermedio.hidden = false;
      cargarNuevasLlegadas('nuevos');
      return;
    }

    const resultados = productos.filter(function (p) {
      return p.nombre.toLowerCase().includes(termino) ||
             p.categoria.toLowerCase().includes(termino);
    });

    if (tituloGrid) tituloGrid.textContent = 'RESULTADOS PARA: "' + termino.toUpperCase() + '"';
    seccionesCat.forEach(function (s) { s.hidden = true; });
    if (bannerIntermedio) bannerIntermedio.hidden = true;

    renderizarProductos(resultados, 'product-grid');
  });
}

// ------------------------------------------
// WHATSAPP
// ------------------------------------------
function enviarPedidoPorWhatsApp() {
  if (carrito.length === 0) return;

  const lineas = carrito.map(function (item) {
    return item.cantidad > 1
      ? '• ' + item.cantidad + 'x ' + item.nombre + ' ($' + (item.precio * item.cantidad).toFixed(2) + ')'
      : '• ' + item.nombre + ' ($' + item.precio.toFixed(2) + ')';
  }).join('\n');

  const mensaje = 'Hola SERENA 🌿, me interesan estos productos:\n\n' +
                  lineas + '\n\nTotal estimado: $' + totalPrecio().toFixed(2) +
                  '\n\n¿Tienen disponibilidad?';

  window.open('https://wa.me/593988698300?text=' + encodeURIComponent(mensaje), '_blank');
  limpiarCarrito();
  cerrarModal('modal-compra');
}

// ------------------------------------------
// ARRANQUE — carga JSON y luego inicializa
// ------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  fetch('productos.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      productos = data;
      cargarNuevasLlegadas('nuevos');
      cargarCategorias();
      inicializarBusqueda();
      actualizarContadorCarrito();
    })
    .catch(function (err) {
      console.error('Error al cargar productos.json:', err);
      const grid = document.getElementById('product-grid');
      if (grid) {
        const aviso = document.createElement('p');
        aviso.className = 'grid-vacio';
        aviso.textContent = 'No se pudo cargar el catálogo. Recarga la página.';
        grid.appendChild(aviso);
      }
    });

  // Carrito
  const carritoBtn = document.getElementById('carrito-btn');
  if (carritoBtn) carritoBtn.addEventListener('click', abrirModalCarrito);

  // WhatsApp
  const btnWA = document.getElementById('btn-ir-whatsapp');
  if (btnWA) btnWA.addEventListener('click', enviarPedidoPorWhatsApp);

  // Cierres de modales
  const ids = [
    ['btn-cerrar-compra',   'modal-compra' ],
    ['btn-cancelar-compra', 'modal-compra' ],
    ['btn-cerrar-detalle',  'modal-detalle'],
  ];
  ids.forEach(function (par) {
    const btn = document.getElementById(par[0]);
    if (btn) btn.addEventListener('click', function () { cerrarModal(par[1]); });
  });

  ['modal-compra', 'modal-detalle'].forEach(function (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal(id);
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cerrarModal('modal-compra');
      cerrarModal('modal-detalle');
    }
  });
});