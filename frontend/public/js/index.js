document.addEventListener('DOMContentLoaded', async () => {
	try {
		// Realizar la solicitud GET a la API
		const response = await fetch('/api/alumnos/asistieron');
		if (!response.ok) {
			throw new Error('Error al obtener las asistencias de hoy');
		}

		// Obtener los datos en formato JSON
		const asistencias = await response.json();
		// Seleccionar el elemento de la tabla
		const tabla = document.getElementById('tabla-asistencias');

		// Verificar si hay asistencias
		if (asistencias.length === 0) {
			tabla.innerHTML = `
                <tr>
                    <td colspan="3" class="p-4 text-gray-500">
                        El día de hoy nadie pasó asistencia.
                    </td>
                </tr>`;
			return;
		}

		// Llenar la tabla con los datos obtenidos
		asistencias.forEach((asistencia) => {
			const fila = document.createElement('tr');
			fila.className =
				'bg-white border-b transition duration-300 ease-in-out hover:bg-gray-200';
			fila.innerHTML = `
                <td class="p-2">${asistencia.nombre}</td>
                <td class="p-2">${asistencia.apellido}</td>
                <td class="p-2">${formatearFecha(asistencia.fecha)}</td>
            `;
			tabla.appendChild(fila);
		});
	} catch (error) {
		console.error(error);
		const tabla = document.getElementById('tabla-asistencias');
		tabla.innerHTML = `
            <tr>
                <td colspan="3" class="p-4 text-red-500">
                    Error al cargar las asistencias.
                </td>
            </tr>`;
	}
});

// Función para formatear fechas
const formatearFecha = (fechaStr) => {
	if (!fechaStr) return '-';
	const fecha = new Date(fechaStr);
	return fecha.toLocaleDateString('es-AR');
};
