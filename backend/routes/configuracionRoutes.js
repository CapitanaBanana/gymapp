const express = require('express');
const router = express.Router();
const {
	getCuotas,
	modificarCuotas,
} = require('../controllers/configuracionController');

// GET → /api/configuracion
router.get('/', getCuotas);

// POST → /api/configuracion/modificar
router.post('/modificar', modificarCuotas);

module.exports = router;
