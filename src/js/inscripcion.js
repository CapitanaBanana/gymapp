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
		};

		// Validaciones básicas
		if (
			!datos.nombre ||
			!datos.apellido ||
			!datos.dni ||
			!datos.email ||
			!datos.telefono
		) {
			alert('Por favor, completá todos los campos.');
			return;
		}

		const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email);
		if (!emailValido) {
			alert('Por favor, ingresá un email válido.');
			return;
		}

		// Enviar datos al backend
		try {
			const res = await fetch('/api/inscripcion', {
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
			} else {
				console.log('ERORR');
			}
		} catch (err) {
			console.error(err);
		}
	});
});
