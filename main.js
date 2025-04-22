let alumnos = [];

async function cargarAlumnos() {
	const res = await fetch('alumnos.json');
	alumnos = await res.json();
	const contenedor = document.getElementById('alumnos-lista');
	contenedor.innerHTML = '';

	alumnos.forEach((alumno) => {
		const div = document.createElement('div');
		div.textContent = alumno.nombre;
		div.onclick = () => mostrarDetalle(alumno.id);
		contenedor.appendChild(div);
	});
}

function mostrarDetalle(id) {
	const alumno = alumnos.find((a) => a.id === id);
	document.getElementById('nombre').textContent = `Nombre: ${alumno.nombre}`;
	document.getElementById('edad').textContent = `Edad: ${alumno.edad}`;
	document.getElementById('plan').textContent = `Plan: ${alumno.plan}`;
	document.getElementById('alumno-detalle').style.display = 'block';
}

function cerrarDetalle() {
	document.getElementById('alumno-detalle').style.display = 'none';
}

cargarAlumnos();
