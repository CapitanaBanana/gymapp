const express = require('express');
const router = express.Router();
const {
	getAlumnos,
	inscribirAlumno,
	getAlumnosDeudores,
	registrarAsistencia,
	getAlumnoByDNI,
} = require('../controllers/alumnosController');

// GET → /api/alumnos
router.get('/', getAlumnos);

// POST → /api/alumnos/inscripcion
router.post('/inscripcion', inscribirAlumno);

// GET → /api/alumnos/deudores
router.get('/deudores', getAlumnosDeudores);

// POST → /api/alumnos/asistencia
router.post('/asistencia', registrarAsistencia);

// GET → /api/alumnos/:dni
router.get('/:dni', getAlumnoByDNI);

module.exports = router;
