import { mostrarToast } from './toast.js';
document.addEventListener('DOMContentLoaded', async () => {
	// Verificar si hay un mensaje en el localStorage
	const mensaje = localStorage.getItem('mensaje');
	const dni = localStorage.getItem('dni');

	if (mensaje) {
		mostrarToast(mensaje, 'success');
		// Eliminar el mensaje después de mostrarlo (opcional)
		localStorage.removeItem('mensaje');
	}

	try {
		const res = await fetch('/api/alumnos');

		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');

		alumnos.forEach((alumno) => {
			const fila = document.createElement('tr');
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

			tabla.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar alumnos:', error);
	}
});
const formatearFecha = (fechaStr) => {
	if (!fechaStr) return '-';
	const fecha = new Date(fechaStr);
	return fecha.toLocaleDateString('es-AR'); // o es-ES
};
