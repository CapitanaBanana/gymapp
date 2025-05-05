document.addEventListener('DOMContentLoaded', async () => {
	const partesUrl = window.location.pathname.split('/');
	const dni = partesUrl[partesUrl.length - 1];

	try {
		const res = await fetch(`/api/alumnos/${dni}`);
		const alumno = await res.json();

		document.getElementById(
			'titulo'
		).textContent = `Perfil de ${alumno.nombre} ${alumno.apellido}`;
		document.getElementById('dni').textContent = alumno.dni;
		document.getElementById('telefono').textContent = alumno.telefono;
		document.getElementById('asistencia').textContent = alumno.ultima_asistencia
			? new Date(alumno.ultima_asistencia).toLocaleDateString('es-AR')
			: '-';
		document.getElementById('pago').textContent = alumno.ultima_fecha_pago
			? new Date(alumno.ultima_fecha_pago).toLocaleDateString('es-AR')
			: '-';
	} catch (error) {
		console.error('Error al cargar alumno:', error);
	}
});
