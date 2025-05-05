import { mostrarToast } from './toast.js';
document.addEventListener('DOMContentLoaded', () => {
	const formulario = document.getElementById('formulario-inscripcion');

	formulario.addEventListener('submit', async (e) => {
		e.preventDefault(); // Evita que se recargue la página

		const datos = {
			nombre: document.getElementById('nombre').value.trim(),
			apellido: document.getElementById('apellido').value.trim(),
			dni: document.getElementById('dni').value.trim(),
			email: document.getElementById('email').value.trim(),
			telefono: document.getElementById('telefono').value.trim(),
			tipo_cuota: document
				.querySelector('input[name="tipo_cuota"]:checked')
				?.value.trim(),
		};

		// Validaciones básicas
		if (
			!datos.nombre ||
			!datos.apellido ||
			!datos.dni ||
			!datos.telefono ||
			!datos.tipo_cuota
		) {
			alert('Por favor, completá todos los campos obligatorios.');
			return;
		}

		const emailValido =
			datos.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email);
		if (!emailValido) {
			alert('Por favor, ingresá un email válido.');
			return;
		}

		// Enviar datos al backend
		try {
			const res = await fetch('/api/alumnos/inscripcion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(datos),
			});

			const resultado = await res.json();
			if (res.ok) {
				console.log(
					'Inscripción exitosa. Te hemos enviado un email de confirmación.'
				);
				formulario.reset();

				localStorage.setItem(
					'mensaje',
					'Inscripción exitosa. El alumno ha sido registrado.'
				);
				localStorage.setItem('dni', datos.dni);

				window.location.href = '/alumnos';
			} else {
				console.log('Error al registrar');
				mostrarToast('Hubo un error al registrar al alumno.', 'error');
			}
		} catch (err) {
			console.error(err);
			mostrarToast('Error en la conexión al servidor.', 'error');
		}
	});
});
