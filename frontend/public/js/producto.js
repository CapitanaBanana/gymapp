document.addEventListener('DOMContentLoaded', async () => {
	const tablaProductos = document.getElementById('tabla-productos');
	const formProductos = document.getElementById('form-productos');
	const agregarProductoBtn = document.getElementById('agregar-producto');

	// Obtener los productos desde el backend
	try {
		const res = await fetch('/api/productos');
		const productos = await res.json();

		// Generar las filas dinámicamente
		productos.forEach((producto) => {
			const fila = document.createElement('tr');
			fila.innerHTML = `
                <td class="table-cell">${producto.nombre}</td>
                <td class="table-cell">
                    <input 
                        type="number" 
                        name="nuevo_precio" 
                        data-id="${producto.id}" 
                        value="${producto.precio}" 
                        class="input w-24 text-center" 
                        min="0" 
                        step="0.01" />
                </td>
                <td class="table-cell">
                    <button 
                        class="btn bg-red-400 text-white px-2 py-1 rounded-lg shadow hover:bg-red-700 transition eliminar-producto"
                        data-id="${producto.id}">
                        ✖
                    </button>
                </td>
            `;
			tablaProductos.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar los productos:', error);
	}

	// Manejar el envío del formulario para modificar precios
	formProductos.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Recopilar los datos del formulario
		const inputs = document.querySelectorAll('input[name="nuevo_precio"]');
		const cambios = Array.from(inputs).map((input) => ({
			id: input.dataset.id,
			precio: parseFloat(input.value),
		}));

		// Validar que todos los valores sean números válidos
		const valoresInvalidos = cambios.some(
			(cambio) => isNaN(cambio.precio) || cambio.precio < 0
		);

		if (valoresInvalidos) {
			alert('Por favor, ingresa valores numéricos válidos para los precios.');
			return;
		}

		// Enviar los datos al backend
		try {
			const res = await fetch('/api/productos/modificar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cambios),
			});

			if (res.ok) {
				alert('Precios actualizados correctamente.');
				location.reload();
			} else {
				alert('Error al actualizar los precios.');
			}
		} catch (error) {
			console.error('Error al enviar los cambios:', error);
		}
	});

	// Manejar clic en el botón "Eliminar Producto"
	tablaProductos.addEventListener('click', async (e) => {
		if (e.target.classList.contains('eliminar-producto')) {
			const id = e.target.dataset.id;

			// Confirmar eliminación
			if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
				return;
			}

			// Enviar solicitud de eliminación al backend
			try {
				const res = await fetch(`/api/productos/eliminar/${id}`, {
					method: 'DELETE',
				});
				if (res.ok) {
					alert('Producto eliminado correctamente.');
					location.reload();
				} else {
					alert('Error al eliminar el producto.');
				}
			} catch (error) {
				console.error('Error al eliminar el producto:', error);
			}
		}
	});

	// Manejar clic en el botón "Agregar Producto"
	agregarProductoBtn.addEventListener('click', async () => {
		const nombre = prompt('Ingrese el nombre del producto:');
		const precio = parseFloat(prompt('Ingrese el precio del producto:'));

		if (!nombre || isNaN(precio) || precio < 0) {
			alert('Datos inválidos. Verifica los valores ingresados.');
			return;
		}

		// Enviar solicitud para agregar el producto
		try {
			const res = await fetch('/api/productos/agregar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nombre, precio }),
			});
			if (res.ok) {
				alert('Producto agregado correctamente.');
				location.reload();
			} else {
				alert('Error al agregar el producto.');
			}
		} catch (error) {
			console.error('Error al agregar el producto:', error);
		}
	});
});
