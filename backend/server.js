require('dotenv').config({ path: '../.env' }); // ajustá según tu estructura
const express = require('express');
const cors = require('cors');
const path = require('path');
//los "imports" de las rutas
const alumnosRoutes = require('./routes/alumnosRoutes');
const pagesRoutes = require('./routes/mainRoutes');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'src'))); //sale de la carpeta backend y entra a src

// Rutas API
app.use('/api/alumnos', alumnosRoutes);
app.use('/', pagesRoutes);

// Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
