document.addEventListener('DOMContentLoaded', async () => {
	const productoSelect = document.getElementById('producto-select');
	const cantidadInput = document.getElementById('cantidad');
	const agregarVentaBtn = document.getElementById('agregar-venta');
	const tablaVentas = document.getElementById('tabla-ventas');
	const confirmarVentasBtn = document.getElementById('confirmar-ventas');
	const ventas = [];

	// Traer productos y llenar el select
	try {
		const res = await fetch('/api/productos');
		const productos = await res.json();
		productos.forEach((producto) => {
			const option = document.createElement('option');
			option.value = producto.id;
			option.textContent = `${producto.nombre} ($${producto.precio})`;
			productoSelect.appendChild(option);
		});
	} catch (error) {
		console.error('Error al cargar productos:', error);
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
		const cantidad = parseInt(cantidadInput.value, 10);

		if (!producto_id || isNaN(cantidad) || cantidad < 1) {
			alert('Selecciona un producto y una cantidad válida.');
			return;
		}

		ventas.push({ producto_id, cantidad });
		renderVentas();
		// Limpiar campos
		productoSelect.value = '';
		cantidadInput.value = '';
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
			alert('Agrega al menos una venta.');
			return;
		}

		try {
			const res = await fetch('/api/ventas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(ventas),
			});

			if (res.ok) {
				alert('Ventas registradas correctamente.');
				location.reload();
			} else {
				alert('Error al registrar las ventas.');
			}
		} catch (error) {
			console.error('Error al registrar ventas:', error);
		}
	});
});
