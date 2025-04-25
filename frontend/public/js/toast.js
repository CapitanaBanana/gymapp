document.addEventListener('DOMContentLoaded', () => {
	verificarYMostrarToast();
});
export function mostrarToast(mensaje, tipo = 'success') {
	const toast = document.createElement('div');
	toast.className = `p-4 rounded-xl shadow-lg transition-opacity duration-500 ${
		tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
	}`;
	toast.innerText = mensaje;
	toast.style.opacity = 1;

	const contenedor = document.getElementById('toast-container');
	if (contenedor) {
		contenedor.appendChild(toast);
		setTimeout(() => {
			toast.classList.add('opacity-0');
			setTimeout(() => toast.remove(), 500);
		}, 4000);
	}
}
export function verificarYMostrarToast() {
	const mensaje = localStorage.getItem('mensaje');
	const tipo = localStorage.getItem('mensaje_tipo') || 'success';

	if (mensaje) {
		mostrarToast(mensaje, tipo);
		localStorage.removeItem('mensaje');
		localStorage.removeItem('mensaje_tipo');
	}
}
