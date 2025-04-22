const express = require('express');
const router = express.Router();
const {
	getAlumnos,
	inscribirAlumno,
} = require('../controllers/alumnosController');

// GET → /api/alumnos
router.get('/', getAlumnos);

// POST → /api/alumnos/inscripcion
router.post('/inscripcion', inscribirAlumno);

module.exports = router;
