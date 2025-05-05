require('dotenv').config({ path: '../.env' }); // ajustá según tu estructura
const express = require('express');
const cors = require('cors');
const ejsLocals = require('ejs-locals');
const path = require('path');
//los "imports" de las rutas
const alumnosRoutes = require('./routes/alumnosRoutes');
const pagesRoutes = require('./routes/mainRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes');
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de EJS
app.engine('ejs', ejsLocals);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Rutas API
app.use('/api/alumnos', alumnosRoutes);
app.use('/', pagesRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
