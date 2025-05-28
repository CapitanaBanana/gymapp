document.addEventListener('DOMContentLoaded', async () => {
	const partesUrl = window.location.pathname.split('/');
	const dni = partesUrl[partesUrl.length - 1];

	try {
		const res = await fetch(`/api/alumnos/${dni}`);
		const alumno = await res.json();
		console.log(alumno);
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
		// Lógica para el botón Agregar cuota
		const btnAgregarCuota = document.getElementById('agregar-cuota');
		btnAgregarCuota.addEventListener('click', async () => {
			try {
				const res = await fetch(`/api/cuotas/agregar`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ dni: alumno.dni }),
				});
				if (res.ok) {
					alert('Cuota agregada correctamente.');
					location.reload();
				} else {
					alert('Error al agregar cuota.');
				}
			} catch (error) {
				alert('Error al agregar cuota.');
			}
		});
	} catch (error) {
		console.error('Error al cargar alumno:', error);
	}
});
