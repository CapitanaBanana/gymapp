const pool = require('../db');

const getAlumnos = async (req, res) => {
	// console.log('Entrando a GET /alumnos');
	try {
		const result = await pool.query('SELECT * FROM alumnos');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener alumnos');
	}
};

const inscribirAlumno = async (req, res) => {
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
};

module.exports = {
	getAlumnos,
	inscribirAlumno,
};
