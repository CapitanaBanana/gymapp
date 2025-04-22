require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (como CSS y JS desde /src)
app.use(express.static(path.join(__dirname, 'src')));

// Conexión a PostgreSQL
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// Obtener todos los alumnos
app.get('/api/alumnos', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM alumnos');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener alumnos');
	}
});

app.post('/api/inscripcion', async (req, res) => {
	// VER PORQUE NO LLEGA AL BACK!
	const { nombre, apellido, dni, email, telefono } = req.body;

	try {
		await pool.query(
			'INSERT INTO alumnos (nombre, apellido, dni, email, telefono) VALUES ($1, $2, $3, $4, $5)',
			[nombre, apellido, dni, email, telefono]
		);
		res.status(200).json({ mensaje: 'Inscripción guardada' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
	}
});

// // Insertar nuevo alumno
// app.post('/alumnos', async (req, res) => {
// 	const { nombre, apellido, email, telefono } = req.body;
// 	try {
// 		const result = await pool.query(
// 			'INSERT INTO alumnos (nombre, apellido, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
// 			[nombre, apellido, email, telefono]
// 		);
// 		res.status(201).json(result.rows[0]);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).send('Error al insertar alumno');
// 	}
// });

// Servir la página principal
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/html', 'index.html'));
});

// También podrías servir inscripcion.html si haces una ruta distinta
app.get('/inscripcion', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/html', 'inscripcion.html'));
});

// Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.get('/alumnos', (req, res) => {
	res.sendFile(path.join(__dirname, 'src/html', 'alumnos.html'));
});
