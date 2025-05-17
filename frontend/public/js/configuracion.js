import { mostrarToast } from './toast.js';
document.addEventListener('DOMContentLoaded', async () => {
	const tablaPrecios = document.getElementById('tabla-precios');
	const formPrecios = document.getElementById('form-precios');
	const agregarDiaExtraBtn = document.getElementById('agregar-dia-extra');

	// Obtener los precios de las cuotas desde el backend
	try {
		const res = await fetch('/api/configuracion');
		const cuotas = await res.json();

		// Mapear los precios por nombre para fácil acceso
		const precios = {};
		cuotas.forEach((cuota) => {
			precios[cuota.nombre] = { id: cuota.id, monto: cuota.monto };
		});

		const tipos = [
			{ tipo: 'dos', label: 'Dos días' },
			{ tipo: 'tres', label: 'Tres días' },
			{ tipo: 'libre', label: 'Libre' },
		];

		tablaPrecios.innerHTML = '';
		tipos.forEach(({ tipo, label }) => {
			const idEfectivo = precios[`${tipo}_efec`]?.id ?? '';
			const montoEfectivo = precios[`${tipo}_efec`]?.monto ?? '';
			const idTransf = precios[tipo]?.id ?? '';
			const montoTransf = precios[tipo]?.monto ?? '';

			const fila = document.createElement('tr');
			fila.innerHTML = `
            <td class="table-cell font-semibold">${label}</td>
            <td class="table-cell">
                <input 
                    type="number" 
                    name="nuevo_precio_efec" 
                    data-id="${idEfectivo}" 
                    value="${montoEfectivo}" 
                    class="input w-24 text-center" 
                    min="0" 
                    step="0.01" />
            </td>
            <td class="table-cell">
                <input 
                    type="number" 
                    name="nuevo_precio_transf" 
                    data-id="${idTransf}" 
                    value="${montoTransf}" 
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
		const inputs = document.querySelectorAll('input[type="number"][data-id]');
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
				localStorage.setItem('mensaje', 'Precios actualizados correctamente.');
				location.reload();
			} else {
				mostrarToast('Hubo un error al registrar al alumno.', 'error');
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
				mostrarToast('Hubo un error al agregar un dia.', 'error');
			}
		} catch (error) {
			console.error('Error al agregar día extra:', error);
		}
	});
});
