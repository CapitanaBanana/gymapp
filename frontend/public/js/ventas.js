import { mostrarToast } from './toast.js';
document.addEventListener('DOMContentLoaded', async () => {
	const productoSelect = document.getElementById('producto-select');
	const cantidadSelect = document.getElementById('cantidad-select');
	const cantidadInput = document.getElementById('cantidad-input');
	const agregarVentaBtn = document.getElementById('agregar-venta');
	const tablaVentas = document.getElementById('tabla-ventas');
	const confirmarVentasBtn = document.getElementById('confirmar-ventas');
	const ventas = [];
	let productos = []; // <-- Declarar aquí

	// Mostrar/ocultar input según selección
	cantidadSelect.addEventListener('change', () => {
		if (cantidadSelect.value === 'otro') {
			cantidadInput.style.display = '';
			cantidadInput.value = '';
			cantidadInput.focus();
		} else {
			cantidadInput.style.display = 'none';
			cantidadInput.value = '';
		}
	});

	// Traer productos y llenar el select
	try {
		const res = await fetch('/api/productos');
		productos = await res.json();
		productos.forEach((producto) => {
			const option = document.createElement('option');
			option.value = producto.id;
			option.textContent = `${producto.nombre} ($${producto.precio})`;
			productoSelect.appendChild(option);
		});
	} catch (error) {
		console.error('Error al cargar productos:', error);
	}

	// Función para obtener el nombre del producto por id
	function getNombreProducto(id) {
		const prod = productos.find((p) => p.id == id);
		return prod ? prod.nombre : 'Producto eliminado';
	}

	// Renderizar la tabla de ventas
	function renderVentas() {
		tablaVentas.innerHTML = '';
		ventas.forEach((venta, idx) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
        <td class="table-cell">${getNombreProducto(venta.producto_id)}</td>
        <td class="table-cell">${venta.cantidad}</td>
        <td class="table-cell">
          <button type="button" class="btn bg-red-400 text-white px-2 py-1 rounded-lg shadow hover:bg-red-700 transition eliminar-venta" data-idx="${idx}">✖</button>
        </td>
      `;
			tablaVentas.appendChild(tr);
		});
	}

	// Agregar venta a la lista
	agregarVentaBtn.addEventListener('click', () => {
		const producto_id = productoSelect.value;
		let cantidad;
		if (cantidadSelect.value === 'otro') {
			cantidad = parseInt(cantidadInput.value, 10);
		} else {
			cantidad = parseInt(cantidadSelect.value, 10);
		}

		if (!producto_id || isNaN(cantidad) || cantidad < 1) {
			mostrarToast('Selecciona un producto y una cantidad válida.', 'error');
			return;
		}

		ventas.push({ producto_id, cantidad });
		renderVentas();
		// Limpiar campos
		productoSelect.value = '';
		cantidadSelect.value = '1';
		cantidadInput.value = '';
		cantidadInput.style.display = 'none';
	});

	// Eliminar venta de la lista
	tablaVentas.addEventListener('click', (e) => {
		if (e.target.classList.contains('eliminar-venta')) {
			const idx = e.target.dataset.idx;
			ventas.splice(idx, 1);
			renderVentas();
		}
	});

	// Confirmar ventas (enviar al backend)
	confirmarVentasBtn.addEventListener('click', async () => {
		if (ventas.length === 0) {
			mostrarToast('Agrega al menos una venta.', 'error');
			return;
		}

		try {
			const res = await fetch('/api/ventas/agregar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(ventas),
			});

			if (res.ok) {
				localStorage.setItem('mensaje', 'Ventas registradas correctamente.');
				location.reload();
			} else {
				mostrarToast('Error al registrar las ventas.', 'error');
			}
		} catch (error) {
			console.error('Error al registrar ventas:', error);
		}
	});
});

async function cargarHistorialVentas() {
	try {
		const res = await fetch('/api/ventas/hoy');
		const ventas = await res.json();
		const tbody = document.getElementById('tabla-historial-ventas');
		tbody.innerHTML = '';
		if (ventas.length === 0) {
			tbody.innerHTML = `
          <tr>
              <td colspan="3" class="p-4 text-gray-500">
                  No hay ventas registradas.
              </td>
          </tr>
      `;
			return;
		}
		ventas.forEach((venta) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
              <td class="table-cell">${venta.nombre_producto}</td>
              <td class="table-cell">${venta.cantidad}</td>
          `;
			tbody.appendChild(tr);
		});
	} catch (error) {
		console.error('Error al cargar historial de ventas:', error);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// ...tu código actual...
	cargarHistorialVentas();
});
