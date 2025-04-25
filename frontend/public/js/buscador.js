// main.js (o el archivo donde manejás la búsqueda)
import { renderListaResultados } from './listaBuscador.js';
document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('busqueda-alumno');
	const listaResultados = document.getElementById('resultados-busqueda');
	let resultados = [];
	input.addEventListener('input', async () => {
		const valor = input.value.trim().toLowerCase();
		if (valor.length === 0) {
			listaResultados.classList.add('hidden');
			return;
		}

		try {
			const res = await fetch('/api/alumnos');
			const alumnos = await res.json();

			resultados = alumnos.filter((a) =>
				`${a.nombre} ${a.apellido}`.toLowerCase().includes(valor)
			);

			renderListaResultados(resultados, (alumno) => {
				marcarAsistencia(alumno.id);
			});
		} catch (error) {
			console.error('Error al buscar alumnos:', error);
		}
	});

	// Enter si hay un solo resultado
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && resultados.length === 1) {
			e.preventDefault();
			marcarAsistencia(resultados[0].id);
		}
	});

	const marcarAsistencia = async (alumnoId) => {
		try {
			await fetch('/api/alumnos/asistencia', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ alumnoId }),
			});
			localStorage.setItem('mensaje', 'Asistencia registrada con éxito');
			localStorage.setItem('mensaje_tipo', 'success');
			input.value = '';
			listaResultados.classList.add('hidden');
		} catch (err) {
			console.error(err);
			localStorage.setItem('mensaje', 'Error al registrar asistencia');
			localStorage.setItem('mensaje_tipo', 'error');
		}
	};
});
