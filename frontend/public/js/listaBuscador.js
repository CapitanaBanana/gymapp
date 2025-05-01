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
			'flex items-center gap-3 p-2 bg-white text-gray-800 hover:bg-gray-200 border-b border-gray-200 rounded-md shadow-sm transition-all duration-200 ease-in-out cursor-pointer';
		li.textContent = `${alumno.nombre} ${alumno.apellido}`;
		li.addEventListener('click', () => onClickItem(alumno));
		listaResultados.appendChild(li);
	});
}
