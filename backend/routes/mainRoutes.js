const express = require('express');
const path = require('path');
const router = express.Router();

// Ruta para index.html
router.get('/', (req, res) => {
	//sale de la carpeta routes, sale de backend y entra a src/html y buscan index.html
	res.sendFile(path.join(__dirname, '..', '..', 'src/html', 'index.html'));
});

// Ruta para inscripcion.html
router.get('/inscripcion', (req, res) => {
	res.sendFile(
		path.join(__dirname, '..', '..', 'src/html', 'inscripcion.html')
	);
});

module.exports = router;
