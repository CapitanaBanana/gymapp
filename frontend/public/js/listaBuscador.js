export function renderListaResultados(resultados, onClickItem) {
	const listaResultados = document.getElementById('resultados-busqueda');
	listaResultados.innerHTML = '';

	if (resultados.length === 0) {
		listaResultados.classList.add('hidden');
		return;
	}

	listaResultados.classList.remove('hidden');

	resultados.forEach((alumno) => {
		const li = document.createElement('li');
		li.className =
			'p-2 bg-white text-black hover:bg-blue-100 cursor-pointer border-b border-gray-200';
		li.textContent = `${alumno.nombre} ${alumno.apellido}`;
		li.addEventListener('click', () => onClickItem(alumno));
		listaResultados.appendChild(li);
	});
}
