import { mostrarToast } from './toast.js';
document.addEventListener('DOMContentLoaded', async () => {
	// Verificar si hay un mensaje en el localStorage
	const mensaje = localStorage.getItem('mensaje');

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

			fila.innerHTML = `
        <td class="p-2">${alumno.nombre}</td>
        <td class="p-2">${alumno.apellido}</td>
        <td class="p-2">${alumno.email}</td>
        <td class="p-2">${alumno.telefono}</td>
      `;

			tabla.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar alumnos:', error);
	}
});
