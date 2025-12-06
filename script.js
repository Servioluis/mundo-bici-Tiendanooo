// Productos de la tienda
const productos = [
  {
    id: 'BICI001',
    nombre: 'Bicicleta Montaña Pro',
    descripcion: 'Bicicleta de montaña profesional con suspensión delantera',
    precio: 2500000,
    imagen: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
    categoria: 'Montaña',
    stock: 15,
    destacado: true
  },
  {
    id: 'BICI002',
    nombre: 'Bicicleta Ruta Carbon',
    descripcion: 'Bicicleta de ruta con cuadro de carbono ultraligero',
    precio: 3800000,
    imagen: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
    categoria: 'Ruta',
    stock: 8,
    destacado: true
  },
  {
    id: 'BICI003',
    nombre: 'Bicicleta Urbana Classic',
    descripcion: 'Bicicleta urbana clásica ideal para la ciudad',
    precio: 1200000,
    imagen: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400',
    categoria: 'Urbana',
    stock: 20,
    destacado: false
  },
  {
    id: 'ACC001',
    nombre: 'Casco Pro Safety',
    descripcion: 'Casco profesional con certificación de seguridad',
    precio: 180000,
    imagen: 'https://images.unsplash.com/photo-1614019874644-98a93f0cc3f1?w=400',
    categoria: 'Accesorios',
    stock: 30,
    destacado: true
  },
  {
    id: 'ACC002',
    nombre: 'Guantes Ciclismo',
    descripcion: 'Guantes acolchados para mayor comodidad',
    precio: 65000,
    imagen: 'https://images.unsplash.com/photo-1582106245687-086f4bc72ddd?w=400',
    categoria: 'Accesorios',
    stock: 50,
    destacado: false
  },
  {
    id: 'REP001',
    nombre: 'Kit Reparación Completo',
    descripcion: 'Kit completo con herramientas básicas',
    precio: 95000,
    imagen: 'https://images.unsplash.com/photo-1618281237468-4f2e58b03976?w=400',
    categoria: 'Repuestos',
    stock: 25,
    destacado: false
  },
  {
    id: 'BICI004',
    nombre: 'Bicicleta Montaña XTR',
    descripcion: 'Suspensión completa, frenos hidráulicos',
    precio: 4200000,
    imagen: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400',
    categoria: 'Montaña',
    stock: 6,
    destacado: true
  },
  {
    id: 'BICI005',
    nombre: 'Bicicleta Ruta Sprint',
    descripcion: 'Perfecta para competencias y entrenamientos',
    precio: 2800000,
    imagen: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400',
    categoria: 'Ruta',
    stock: 10,
    destacado: false
  },
  {
    id: 'ACC003',
    nombre: 'Luces LED Set',
    descripcion: 'Set de luces delantera y trasera recargables',
    precio: 120000,
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    categoria: 'Accesorios',
    stock: 40,
    destacado: false
  }
];

let carrito = [];
let categoriaActual = 'Todas';

// Inicializar la aplicación
window.addEventListener('DOMContentLoaded', () => {
  cargarCarritoLocal();
  mostrarProductos();
  
  // Event listener para el formulario
  document.getElementById('checkoutForm').addEventListener('submit', procesarPedido);
});

// Mostrar productos en la interfaz
function mostrarProductos() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const productosFiltrados = categoriaActual === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActual);

  if (productosFiltrados.length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px; color: #666;">No hay productos en esta categoría</p>';
    return;
  }

  productosFiltrados.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div style="position: relative;">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
        ${producto.destacado ? '<span class="product-badge">⭐ Destacado</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${producto.categoria}</div>
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <div class="product-stock">Stock disponible: ${producto.stock} unidades</div>
        <div class="product-footer">
          <div class="product-price">$${producto.precio.toLocaleString('es-CO')}</div>
          <button class="btn-add" onclick="agregarAlCarrito('${producto.id}')">
            Agregar
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filtrar por categoría
function filterByCategory(categoria) {
  categoriaActual = categoria;
  mostrarProductos();
  scrollToProducts();
}

// Scroll a productos
function scrollToProducts() {
  document.getElementById('productos').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
  const producto = productos.find(p => p.id === idProducto);
  
  if (!producto) {
    mostrarError('Producto no encontrado');
    return;
  }

  const itemExistente = carrito.find(item => item.id === idProducto);
  
  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad++;
    } else {
      mostrarError('No hay más stock disponible');
      return;
    }
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
      stock: producto.stock
    });
  }

  guardarCarritoLocal();
  actualizarCarrito();
  mostrarNotificacion('Producto agregado al carrito');
}

// Actualizar visualización del carrito
function actualizarCarrito() {
  const cartCount = document.getElementById('cartCount');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  cartCount.textContent = totalItems;

  if (carrito.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    cartTotal.textContent = '$0';
    return;
  }

  let html = '';
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    html += `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.nombre}</div>
          <div class="cart-item-price">$${item.precio.toLocaleString('es-CO')}</div>
          <div class="cart-item-controls">
            <button class="btn-qty" onclick="cambiarCantidad('${item.id}', -1)">-</button>
            <span class="cart-item-qty">${item.cantidad}</span>
            <button class="btn-qty" onclick="cambiarCantidad('${item.id}', 1)">+</button>
            <button class="btn-remove" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
          </div>
          <div style="margin-top: 5px; font-weight: bold; color: var(--primary);">
            Subtotal: $${subtotal.toLocaleString('es-CO')}
          </div>
        </div>
      </div>
    `;
  });

  cartBody.innerHTML = html;
  cartTotal.textContent = '$' + total.toLocaleString('es-CO');
}

// Cambiar cantidad de producto
function cambiarCantidad(idProducto, cambio) {
  const item = carrito.find(i => i.id === idProducto);
  
  if (!item) return;

  const nuevaCantidad = item.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }

  if (nuevaCantidad > item.stock) {
    mostrarError('No hay suficiente stock disponible');
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarCarritoLocal();
  actualizarCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto);
  guardarCarritoLocal();
  actualizarCarrito();
  mostrarNotificacion('Producto eliminado del carrito');
}

// Toggle carrito lateral
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Mostrar modal de checkout
function showCheckout() {
  if (carrito.length === 0) {
    mostrarError('El carrito está vacío');
    return;
  }

  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('overlay');
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');

  let html = '';
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="checkout-item">
        <span>${item.nombre} x${item.cantidad}</span>
        <span>$${subtotal.toLocaleString('es-CO')}</span>
      </div>
    `;
  });

  checkoutItems.innerHTML = html;
  checkoutTotal.textContent = '$' + total.toLocaleString('es-CO');

  modal.classList.add('active');
  overlay.classList.add('active');
  
  // Cerrar sidebar del carrito
  document.getElementById('cartSidebar').classList.remove('active');
}

// Cerrar checkout
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// Cerrar todo
function closeAll() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('checkoutModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// Procesar pedido (Enviar por WhatsApp)
function procesarPedido(e) {
  e.preventDefault();
  
  const cliente = document.getElementById('clienteNombre').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const telefono = document.getElementById('clienteTelefono').value.trim();
  const direccion = document.getElementById('clienteDireccion').value.trim();

  if (!cliente || !email || !telefono || !direccion) {
    mostrarError('Por favor completa todos los campos');
    return;
  }

  // Crear mensaje para WhatsApp
  let mensaje = `🚴‍♂️ *NUEVO PEDIDO - EL MUNDO DE LA BICI*\n\n`;
  mensaje += `👤 *Cliente:* ${cliente}\n`;
  mensaje += `📧 *Email:* ${email}\n`;
  mensaje += `📱 *Teléfono:* ${telefono}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n\n`;
  mensaje += `🛒 *PRODUCTOS:*\n`;
  mensaje += `━━━━━━━━━━━━━━━━\n`;
  
  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `\n▪️ ${item.nombre}\n`;
    mensaje += `   Cantidad: ${item.cantidad}\n`;
    mensaje += `   Precio: $${item.precio.toLocaleString('es-CO')}\n`;
    mensaje += `   Subtotal: $${subtotal.toLocaleString('es-CO')}\n`;
  });
  
  mensaje += `\n━━━━━━━━━━━━━━━━\n`;
  mensaje += `💰 *TOTAL: $${total.toLocaleString('es-CO')}*\n\n`;
  mensaje += `Gracias por tu compra! 🎉`;

  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Número de WhatsApp de la tienda (cambiar por el tuyo)
  const numeroWhatsApp = '573162378690'; // Formato: código país + número sin espacios
  
  // Crear URL de WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
  
  // Abrir WhatsApp
  window.open(urlWhatsApp, '_blank');
  
  // Limpiar carrito y formulario
  mostrarExito('¡Pedido enviado! Serás redirigido a WhatsApp para confirmar tu compra');
  
  setTimeout(() => {
    carrito = [];
    guardarCarritoLocal();
    actualizarCarrito();
    closeCheckout();
    document.getElementById('checkoutForm').reset();
  }, 2000);
}

// Guardar carrito en localStorage
function guardarCarritoLocal() {
  try {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  } catch (e) {
    console.log('No se pudo guardar el carrito');
  }
}

// Cargar carrito desde localStorage
function cargarCarritoLocal() {
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
  } catch (e) {
    console.log('No se pudo cargar el carrito');
  }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--primary);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

// Mostrar error
function mostrarError(mensaje) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--accent);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Mostrar éxito
function mostrarExito(mensaje) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
