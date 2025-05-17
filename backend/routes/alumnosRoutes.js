const express = require('express');
const router = express.Router();
const {
	getAlumnos,
	inscribirAlumno,
	getAlumnosDeudores,
	registrarAsistencia,
	agregarDiaExtra,
	getAlumnoByDNI,
	getAlumnosQueAsistieronHoy,
} = require('../controllers/alumnosController');

// GET → /api/alumnos
router.get('/', getAlumnos);

// POST → /api/alumnos/inscripcion
router.post('/inscripcion', inscribirAlumno);

// GET → /api/alumnos/asistieron
router.get('/asistieron', getAlumnosQueAsistieronHoy);

// GET → /api/alumnos/deudores
router.get('/deudores', getAlumnosDeudores);

// POST → /api/alumnos/asistencia
router.post('/asistencia', registrarAsistencia);

// POST → /api/alumnos/agregar-dia-extra
router.post('/agregar-dia-extra', agregarDiaExtra);

// GET → /api/alumnos/:dni
router.get('/:dni', getAlumnoByDNI);

module.exports = router;
