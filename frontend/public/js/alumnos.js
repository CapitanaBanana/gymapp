document.addEventListener('DOMContentLoaded', async () => {
	const dni = localStorage.getItem('dni');

	try {
		const res = await fetch('/api/alumnos');

		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');

		alumnos.forEach((alumno) => {
			const fila = document.createElement('tr');
			fila.className =
				'bg-white border-b transition duration-300 ease-in-out cursor-pointer hover:bg-gray-200';
			if (alumno.dni === dni) {
				fila.classList.add('bg-warning');
				setTimeout(() => fila.classList.remove('bg-warning'), 1500);
				localStorage.removeItem('dni');
			}

			fila.innerHTML = `
      <td class="p-2">${alumno.nombre}</td>
      <td class="p-2">${alumno.apellido}</td>
      <td class="p-2">${alumno.telefono}</td>
      <td class="p-2">${formatearFecha(alumno.ultima_asistencia)}</td>
      <td class="p-2">${formatearFecha(alumno.ultima_fecha_pago)}</td>
    `;

			tabla.appendChild(fila);
			fila.addEventListener('click', () => {
				window.location.href = `/alumnos/${alumno.dni}`;
			});
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
