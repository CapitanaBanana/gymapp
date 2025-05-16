const express = require('express');
const router = express.Router();
const {
	getVentas,
	agregarVenta,
	eliminarVenta,
	getVentasHoy,
} = require('../controllers/ventasController');

// GET → /api/ventas
router.get('/', getVentas);
//GET → /api/ventas/hoy
router.get('/hoy', getVentasHoy);
// POST → /api/ventas/agregar
router.post('/agregar', agregarVenta);
// DELETE → /api/ventas/eliminar/:id
router.delete('/eliminar/:id', eliminarVenta);

module.exports = router;
