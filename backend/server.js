require('dotenv').config({ path: '../.env' }); // ajustá según tu estructura
const express = require('express');
const cors = require('cors');
const ejsLocals = require('ejs-locals');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
//los "imports" de las rutas
const alumnosRoutes = require('./routes/alumnosRoutes');
const pagesRoutes = require('./routes/mainRoutes');

const app = express();
const port = 3000;

// Configurar express-session
app.use(
	session({
		secret: process.env.SECRET_KEY, // Cambiar por una clave secreta
		resave: false,
		saveUninitialized: true,
	})
);

// Configurar connect-flash
app.use(flash());

app.use((req, res, next) => {
	res.locals.messages = {
		success: req.flash('success'),
		error: req.flash('error'),
	};
	next();
});
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

// Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
