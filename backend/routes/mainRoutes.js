const express = require('express');
const router = express.Router();

// Ruta para index
router.get('/', (req, res) => {
	res.render('pages/index', { title: 'Inicio - GymApp' });
});

// Ruta para inscripción
router.get('/inscripcion', (req, res) => {
	res.render('pages/inscripcion', { title: 'Inscripción - GymApp' });
});

// Ruta para alumnos
router.get('/alumnos', (req, res) => {
	res.render('pages/alumnos', { title: 'Listado de Alumnos - GymApp' });
});

router.get('/deudores', (req, res) => {
	res.render('pages/listadoDeudores', {
		title: 'Listado de Deudores - GymApp',
	});
});
// Ruta para configuración
router.get('/configuracion', (req, res) => {
	res.render('pages/configuracion', { title: 'Configuración - GymApp' });
});

router.get('/alumnos/:dni', (req, res) => {
	const dni = req.params.dni;
	res.render('pages/perfil', { title: `Perfil de ${dni} - GymApp` });
});

router.get('/productos', (req, res) => {
	res.render('pages/productos', { title: 'Productos - GymApp' });
});
router.get('/ventas', (req, res) => {
	res.render('pages/ventas', { title: 'Ventas - GymApp' });
});

module.exports = router;
