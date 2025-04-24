const pool = require('../db');

const getAlumnos = async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				a.id,
				a.nombre,
				a.apellido,
				a.dni,
				a.email,
				a.telefono,
				-- Última asistencia
				(SELECT fecha 
				 FROM asistencias 
				 WHERE alumno_id = a.id 
				 ORDER BY fecha DESC, hora DESC 
				 LIMIT 1) AS ultima_asistencia,
				-- Último pago
				(SELECT fecha_pago 
				 FROM cuotas 
				 WHERE alumno_id = a.id AND fecha_pago IS NOT NULL
				 ORDER BY fecha_pago DESC 
				 LIMIT 1) AS ultima_fecha_pago
			FROM alumnos a
			ORDER BY a.id
		`);

		// Enviar respuesta con los resultados
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener alumnos');
	}
};

const inscribirAlumno = async (req, res) => {
	const { nombre, apellido, dni, email, telefono } = req.body;
	const emailFinal = email === '' ? null : email; // Si no se ingresa un email, lo dejamos como null

	try {
		await pool.query(
			'INSERT INTO alumnos (nombre, apellido, dni, email, telefono) VALUES ($1, $2, $3, $4, $5)',
			[nombre, apellido, dni, emailFinal, telefono]
		);
		res
			.status(200)
			.json({ mensaje: 'Inscripción exitosa. El alumno ha sido registrado.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
	}
};

const getAlumnosDeudores = async (req, res) => {
	try {
		console.log();
		// Actualizar alumnos con más de 30 días de diferencia entre fecha_pago y la fecha actual
		await pool.query(`
            UPDATE cuotas
            SET adeuda = true
            WHERE adeuda = false AND fecha_pago < CURRENT_DATE - INTERVAL '30 days'
        `);

		// Obtener alumnos que tienen adeuda = true
		const result = await pool.query(`
            SELECT a.id, a.nombre, a.apellido, a.dni, c.monto, c.fecha_pago, c.adeuda
            FROM alumnos a
            JOIN cuotas c ON a.id = c.alumno_id
            WHERE c.adeuda = true
        `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener alumnos adeudadores');
	}
};

module.exports = {
	getAlumnos,
	inscribirAlumno,
	getAlumnosDeudores,
};
