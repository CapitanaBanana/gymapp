document.addEventListener('DOMContentLoaded', async () => {
	const dni = localStorage.getItem('dni');

	try {
		const res = await fetch('/api/alumnos');
		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');
		const contenedorMobile = document.getElementById('alumnos-mobile');

		alumnos.forEach((alumno) => {
			// Fila de la tabla (pantalla grande)
			const fila = document.createElement('tr');
			fila.className = 'table-row';

			if (alumno.dni === dni) {
				fila.classList.add('highlight');
				setTimeout(() => fila.classList.remove('highlight'), 1500);
				localStorage.removeItem('dni');
			}

			fila.innerHTML = `
        <td class="table-cell">${alumno.nombre}</td>
        <td class="table-cell">${alumno.apellido}</td>
        <td class="table-cell">${alumno.telefono}</td>
        <td class="table-cell">${formatearFecha(alumno.ultima_asistencia)}</td>
        <td class="table-cell">${formatearFecha(alumno.ultima_fecha_pago)}</td>
      `;

			fila.addEventListener('click', () => {
				window.location.href = `/alumnos/${alumno.dni}`;
			});
			tabla.appendChild(fila);

			// Tarjeta para dispositivos móviles
			const card = document.createElement('div');
			card.className = 'mobile-card';
			card.innerHTML = `
        <div><strong>${alumno.nombre} ${alumno.apellido}</strong></div>
        <div><strong>Teléfono:</strong> ${alumno.telefono}</div>
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
