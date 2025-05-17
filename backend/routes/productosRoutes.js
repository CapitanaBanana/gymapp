const express = require('express');
const router = express.Router();
const {
	getProductos,
	modificarProductos,
	agregarProducto,
	eliminarProducto,
} = require('../controllers/productosController');

// GET → /api/productos
router.get('/', getProductos);

// POST → /api/productos/modificar
router.post('/modificar', modificarProductos);

// POST → /api/productos/agregar
router.post('/agregar', agregarProducto);

// DELETE → /api/productos/eliminar/:id
router.delete('/eliminar/:id', eliminarProducto);

module.exports = router;
