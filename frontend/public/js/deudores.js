document.addEventListener('DOMContentLoaded', async () => {
	try {
		const res = await fetch('/api/alumnos/deudores');

		const alumnos = await res.json();

		const tabla = document.getElementById('tabla-alumnos');
		const contenedorMobile = document.getElementById('alumnos-mobile');

		alumnos.forEach((alumno) => {
			const fila = document.createElement('tr');
			fila.className = 'table-row';

			fila.innerHTML = `
        <td class="table-cell">${alumno.nombre}</td>
        <td class="table-cell">${alumno.apellido}</td>
        <td class="table-cell">${alumno.telefono}</td>
      `;

			tabla.appendChild(fila);
			// Tarjeta para dispositivos móviles
			const card = document.createElement('div');
			card.className = 'mobile-card';
			card.innerHTML = `
        <div><strong>${alumno.nombre} ${alumno.apellido}</strong></div>
        <div><strong>Teléfono:</strong> ${alumno.telefono}</div>
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
