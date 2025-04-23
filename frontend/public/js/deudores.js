document.addEventListener('DOMContentLoaded', async () => {
	try {
		const res = await fetch('/api/alumnos/deudores');

		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');

		alumnos.forEach((alumno) => {
			const fila = document.createElement('tr');

			fila.innerHTML = `
        <td class="p-2">${alumno.nombre}</td>
        <td class="p-2">${alumno.apellido}</td>
        <td class="p-2">${alumno.telefono}</td>
      `;

			tabla.appendChild(fila);
		});
	} catch (error) {
		console.error('Error al cargar alumnos:', error);
	}
});
