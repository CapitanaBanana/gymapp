document.addEventListener('DOMContentLoaded', async () => {
	const dni = localStorage.getItem('dni');

	try {
		const res = await fetch('/api/alumnos');
		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');
		const contenedorMobile = document.getElementById('alumnos-mobile');

		alumnos.forEach((alumno) => {
			// Tabla (pantalla grande)
			const fila = document.createElement('tr');
			fila.className =
				'bg-white border-b transition duration-300 ease-in-out cursor-pointer hover:bg-gray-200';

			if (alumno.dni === dni) {
				fila.classList.add('bg-yellow-100');
				setTimeout(() => fila.classList.remove('bg-yellow-100'), 1500);
				localStorage.removeItem('dni');
			}

			fila.innerHTML = `
        <td class="p-2">${alumno.nombre}</td>
        <td class="p-2">${alumno.apellido}</td>
        <td class="p-2">${alumno.telefono}</td>
        <td class="p-2">${formatearFecha(alumno.ultima_asistencia)}</td>
        <td class="p-2">${formatearFecha(alumno.ultima_fecha_pago)}</td>
      `;

			fila.addEventListener('click', () => {
				window.location.href = `/alumnos/${alumno.dni}`;
			});
			tabla.appendChild(fila);

			// Tarjeta (pantalla chica)
			const card = document.createElement('div');
			card.className =
				'bg-white p-4 rounded-xl shadow border text-sm flex flex-col gap-2 transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-lg cursor-pointer';
			card.innerHTML = `
        <div><strong>${alumno.nombre} ${alumno.apellido}</strong> </div>
      
        <div><strong>Últ. asistencia:</strong> ${formatearFecha(
					alumno.ultima_asistencia
				)}</div>
        <div><strong>Últ. pago:</strong> ${formatearFecha(
					alumno.ultima_fecha_pago
				)}</div>
      `;
			card.addEventListener('click', () => {
				window.location.href = `/alumnos/${alumno.dni}`;
			});
			contenedorMobile.appendChild(card);
		});
	} catch (error) {
		console.error('Error al cargar alumnos:', error);
	}
});

const formatearFecha = (fechaStr) => {
	if (!fechaStr) return '-';
	const fecha = new Date(fechaStr);
	return fecha.toLocaleDateString('es-AR');
};
