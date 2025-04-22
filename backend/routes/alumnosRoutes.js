const express = require('express');
const router = express.Router();
const {
	getAlumnos,
	inscribirAlumno,
} = require('../controllers/alumnosController');

router.get('/obtener', getAlumnos); // ACA NOSE SI VA '/' o '/alumnos' !!!!!!!!!!!!!
router.post('/inscripcion', inscribirAlumno);

module.exports = router;
