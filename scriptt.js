// ==========================================
// SERENA JOYERÍA — scriptt.js
// ==========================================

'use strict';

// ------------------------------------------
// CATÁLOGO DE PRODUCTOS
// ------------------------------------------
const productos = [
  { nombre: 'Aros Cascada',         precio:  7.99, imagen: 'assets/ARETES/AROS_CASCADA.jpeg',           categoria: 'aretes',   nuevo: false },
  { nombre: 'Heart Chic',           precio: 15.99, imagen: 'assets/COLLARES/HEART_CHIC.png',             categoria: 'collares', nuevo: false },
  { nombre: 'Pink Charm',           precio:  4.99, imagen: 'assets/ARETES/PINK_CHARM.jpeg',              categoria: 'aretes',   nuevo: true  },
  { nombre: 'Blue Charm',           precio: 22.00, imagen: 'assets/ARETES/BLUE_CHARM.jpeg',              categoria: 'aretes',   nuevo: false },
  { nombre: 'Floral Rings',         precio:  7.99, imagen: 'assets/ARETES/FLORAL_RINGS.jpeg',            categoria: 'aretes',   nuevo: true  },
  { nombre: 'Mini Teddy',           precio: 15.99, imagen: 'assets/COLLARES/MINI_TEDDY.png',             categoria: 'collares', nuevo: false },
  { nombre: 'Gafas Vintage',        precio: 14.99, imagen: 'assets/GAFAS/Gafasverdesvintage.png',        categoria: 'gafas',    nuevo: true  },
  { nombre: 'Halo',                 precio:  4.99, imagen: 'assets/ARETES/halo.jpeg',                    categoria: 'aretes',   nuevo: false },
  { nombre: 'Moon Rings',           precio:  4.99, imagen: 'assets/ARETES/MOON_RINGS.jpeg',              categoria: 'aretes',   nuevo: true  },
  { nombre: 'Gafas Negras',         precio: 18.00, imagen: 'assets/GAFAS/Gafasmarconegro.png',           categoria: 'gafas',    nuevo: true  },
  { nombre: 'Rosa Pastel',          precio:  4.99, imagen: 'assets/ARETES/ROSA_PASTEL.jpeg',             categoria: 'aretes',   nuevo: false },
  { nombre: 'Golden Rose',          precio: 10.00, imagen: 'assets/ARETES/GOLDEN_ROSE.jpeg',             categoria: 'aretes',   nuevo: true  },
  { nombre: 'Gafas Pink',           precio: 18.00, imagen: 'assets/GAFAS/Gafasrosas.png',                categoria: 'gafas',    nuevo: true  },
  { nombre: 'Asymmetric',           precio: 10.00, imagen: 'assets/ARETES/ASYMMETRYC.jpeg',              categoria: 'aretes',   nuevo: true  },
  { nombre: 'Cherries',             precio: 10.00, imagen: 'assets/ARETES/CHERRIES.jpeg',                categoria: 'aretes',   nuevo: true  },
  { nombre: 'Anillo Aura',          precio: 12.50, imagen: 'assets/ANILLOS/AURA_GOLD.jpeg',              categoria: 'anillos',  nuevo: true  },
  { nombre: 'Mini Bloom',           precio: 15.99, imagen: 'assets/COLLARES/MINI_BLOOM.png',             categoria: 'collares', nuevo: false },
  { nombre: 'Drop Glow',            precio: 15.99, imagen: 'assets/COLLARES/DROP_GLOW.png',              categoria: 'collares', nuevo: false },
  { nombre: 'Equilibrio',           precio: 15.99, imagen: 'assets/COLLARES/EQUILIBRIO.png',             categoria: 'collares', nuevo: false },
  { nombre: 'Mini Love',            precio: 15.99, imagen: 'assets/COLLARES/MINI_LOVE.png',              categoria: 'collares', nuevo: false },
  { nombre: 'Gafas Miel',           precio: 18.00, imagen: 'assets/GAFAS/Gafascuadradasmiel.png',        categoria: 'gafas',    nuevo: true  },
  { nombre: 'Gafas Vino',           precio: 18.00, imagen: 'assets/GAFAS/Gafascuadradasvino.png',        categoria: 'gafas',    nuevo: false },
  { nombre: 'Gafas Redondas Negras',precio: 18.00, imagen: 'assets/GAFAS/Gafasredondasnegras.png',       categoria: 'gafas',    nuevo: false },
  { nombre: 'Gafas Rosa',           precio: 18.00, imagen: 'assets/GAFAS/Gafasredondasrosa.png',         categoria: 'gafas',    nuevo: false },
];

// ------------------------------------------
// IMAGEN DE RESPALDO (SVG inline, sin petición de red)
// ------------------------------------------
const IMAGEN_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='280' viewBox='0 0 300 280'%3E%3Crect width='300' height='280' fill='%23f5f3ef'/%3E%3Ctext x='50%25' y='45%25' font-family='Georgia,serif' font-size='28' fill='%23a3ad99' text-anchor='middle' dominant-baseline='middle' letter-spacing='4'%3ESERENA%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Georgia,serif' font-size='11' fill='%23c5a059' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'%3Ejoyería%3C/text%3E%3C/svg%3E";

// ------------------------------------------
// CARRITO
// ------------------------------------------
let carrito = [];

/** Devuelve la cantidad total de ítems en el carrito. */
function totalItems() {
  return carrito.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
}

/** Devuelve el precio total del carrito. */
function totalPrecio() {
  return carrito.reduce(function (sum, item) { return sum + item.precio * item.cantidad; }, 0);
}

/** Agrega un producto al carrito (o incrementa su cantidad si ya existe). */
function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(function (item) { return item.nombre === nombre; });
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarFeedbackBoton(nombre);
}

/** Elimina un ítem del carrito por su índice. */
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContadorCarrito();
  refrescarContenidoModal();       // refresca sin reabrir el modal
}

/** Vacía el carrito por completo. */
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

/** Marca visualmente el botón de un producto como "agregado" por 1.4 s. */
function mostrarFeedbackBoton(nombre) {
  const tarjetas = document.querySelectorAll('.product-item');
  tarjetas.forEach(function (tarjeta) {
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
    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-item';

    // Imagen — al hacer clic abre el detalle
    const img = document.createElement('img');
    img.src = p.imagen;
    img.alt = p.nombre + ' – Serena Joyería Ecuador';
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      this.onerror = null;
      this.src = IMAGEN_PLACEHOLDER;
    });
    img.addEventListener('click', function () { verDetalle(p.nombre); });

    // Detalles
    const detalles = document.createElement('div');
    detalles.className = 'product-details';

    const h3 = document.createElement('h3');
    h3.textContent = p.nombre;

    const precio = document.createElement('p');
    precio.textContent = '$' + p.precio.toFixed(2);

    const btn = document.createElement('button');
    btn.className = 'btn-agregar';
    btn.textContent = 'AGREGAR';
    btn.addEventListener('click', function () {
      agregarAlCarrito(p.nombre, p.precio);
      abrirModalCarrito();
    });

    detalles.appendChild(h3);
    detalles.appendChild(precio);
    detalles.appendChild(btn);

    tarjeta.appendChild(img);
    tarjeta.appendChild(detalles);
    grid.appendChild(tarjeta);
  });
}

function cargarNuevasLlegadas(orden) {
  orden = orden || 'nuevos';
  let lista = productos.slice();

  if (orden === 'nuevos') {
    lista.sort(function (a, b) { return b.nuevo - a.nuevo; });
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

/** Actualiza el HTML interno del modal sin reabrirlo. */
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
// MODAL — DETALLE DE PRODUCTO
// ------------------------------------------
function verDetalle(nombre) {
  const p = productos.find(function (item) { return item.nombre === nombre; });
  if (!p) return;

  document.getElementById('det-img').src        = p.imagen;
  document.getElementById('det-img').alt        = p.nombre + ' – Serena Joyería';
  document.getElementById('det-nombre').textContent = p.nombre;
  document.getElementById('det-precio').textContent = '$' + p.precio.toFixed(2);
  document.getElementById('det-desc').textContent   =
    p.descripcion || 'Pieza única, diseñada con materiales de alta calidad y acabados elegantes. Ideal para resaltar tu estilo diario.';

  const btnAgregar = document.getElementById('det-btn-agregar');
  // Remover listeners anteriores clonando el nodo
  const btnNuevo = btnAgregar.cloneNode(true);
  btnNuevo.addEventListener('click', function () {
    agregarAlCarrito(p.nombre, p.precio);
    cerrarDetalle();
    abrirModalCarrito();
  });
  btnAgregar.parentNode.replaceChild(btnNuevo, btnAgregar);

  abrirModal('modal-detalle');
}

// ------------------------------------------
// MODAL — HELPERS GENÉRICOS
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

  const tituloGrid      = document.querySelector('#new-arrivals h2');
  const seccionesCat    = document.querySelectorAll('.category-section');
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
// MENSAJE DE WHATSAPP
// ------------------------------------------
/** Genera y abre el mensaje de WhatsApp con el contenido actual del carrito. */
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

  window.open('https://wa.me/593992881283?text=' + encodeURIComponent(mensaje), '_blank');
  limpiarCarrito();
  cerrarModal('modal-compra');
}

// ------------------------------------------
// INICIALIZACIÓN
// ------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  // Cargar grillas
  cargarNuevasLlegadas('nuevos');
  cargarCategorias();

  // Búsqueda
  inicializarBusqueda();

  // Badge inicial oculto
  actualizarContadorCarrito();

  // Botón del carrito en el header
  const carritoBtn = document.getElementById('carrito-btn');
  if (carritoBtn) {
    carritoBtn.addEventListener('click', function () {
      abrirModalCarrito();
    });
  }

  // Botón "Ir a WhatsApp"
  const btnWhatsApp = document.getElementById('btn-ir-whatsapp');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', enviarPedidoPorWhatsApp);
  }

  // Botones de cierre de modales (definidos en index.html vía JS, pero por si acaso)
  const btnCerrarCompra  = document.getElementById('btn-cerrar-compra');
  const btnCancelarCompra = document.getElementById('btn-cancelar-compra');
  const btnCerrarDetalle  = document.getElementById('btn-cerrar-detalle');

  if (btnCerrarCompra)   btnCerrarCompra.addEventListener('click',   function () { cerrarModal('modal-compra');  });
  if (btnCancelarCompra) btnCancelarCompra.addEventListener('click',  function () { cerrarModal('modal-compra');  });
  if (btnCerrarDetalle)  btnCerrarDetalle.addEventListener('click',   function () { cerrarModal('modal-detalle'); });

  // Cerrar al hacer clic en el fondo del modal
  ['modal-compra', 'modal-detalle'].forEach(function (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModal(id);
      });
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cerrarModal('modal-compra');
      cerrarModal('modal-detalle');
    }
  });
});