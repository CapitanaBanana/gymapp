const express = require('express');
const path = require('path');
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

router.get('/alumnos/:dni', (req, res) => {
	const dni = req.params.dni;
	res.render('pages/perfil', { title: `Perfil de ${dni} - GymApp` });
});

module.exports = router;
