document.addEventListener('DOMContentLoaded', async () => {
	const tablaPrecios = document.getElementById('tabla-precios');
	const formPrecios = document.getElementById('form-precios');
	const agregarDiaExtraBtn = document.getElementById('agregar-dia-extra');

	// Obtener los precios de las cuotas desde el backend
	try {
		const res = await fetch('/api/configuracion');
		const cuotas = await res.json();

		// Generar las filas dinámicamente
		cuotas.forEach((cuota) => {
			const fila = document.createElement('tr');
			fila.innerHTML = `
                <td class="table-cell">${cuota.nombre}</td>
				<td class="table-cell">$${Number(cuota.monto).toFixed(2)}</td>
				<td class="table-cell">
                    <input 
                        type="number" 
                        name="nuevo_precio" 
                        data-id="${cuota.id}" 
                        value="${cuota.monto}" 
                        class="input w-24 text-center" 
                        min="0" 
                        step="0.01" />
                </td>
            `;
			tablaPrecios.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar los precios:', error);
	}

	// Manejar el envío del formulario
	formPrecios.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Recopilar los datos del formulario
		const inputs = document.querySelectorAll('input[name="nuevo_precio"]');
		const cambios = Array.from(inputs).map((input) => ({
			id: input.dataset.id,
			monto: parseFloat(input.value),
		}));

		// Validar que todos los valores sean números válidos
		const valoresInvalidos = cambios.some(
			(cambio) => isNaN(cambio.monto) || cambio.monto < 0
		);

		if (valoresInvalidos) {
			alert('Por favor, ingresa valores numéricos válidos para los precios.');
			return;
		}

		// Enviar los datos al backend
		try {
			const res = await fetch('/api/configuracion/modificar', {
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
	// Manejar clic en el botón "Agregar Día Extra"
	agregarDiaExtraBtn.addEventListener('click', async () => {
		try {
			const res = await fetch('/api/alumnos/agregar-dia-extra', {
				method: 'POST',
			});
			if (res.ok) {
				localStorage.setItem('mensaje', 'Agregacion de dia exitoso.');
				window.location.href = '/alumnos';
			} else {
				alert('Error al agregar día extra.');
			}
		} catch (error) {
			console.error('Error al agregar día extra:', error);
		}
	});
});
