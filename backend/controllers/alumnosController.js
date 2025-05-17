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

const registrarAsistencia = async (req, res) => {
	const { alumnoId } = req.body;
	if (!alumnoId) {
		return res.status(400).json({ mensaje: 'ID de alumno no proporcionado' });
	}
	try {
		await pool.query(
			'INSERT INTO asistencias (alumno_id, fecha, hora) VALUES ($1, CURRENT_DATE, CURRENT_TIME)',
			[alumnoId]
		);
		res.status(200).json({ mensaje: 'Asistencia registrada' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al registrar asistencia' });
	}
};
const inscribirAlumno = async (req, res) => {
	const { nombre, apellido, dni, email, telefono, tipo_cuota } = req.body;
	const emailFinal = email === '' ? null : email; // Si no se ingresa un email, lo dejamos como null

	try {
		// Insertar el alumno y obtener su id
		const alumnoResult = await pool.query(
			'INSERT INTO alumnos (nombre, apellido, dni, email, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING id',
			[nombre, apellido, dni, emailFinal, telefono]
		);
		const alumnoId = alumnoResult.rows[0].id;

		// Obtener el monto correspondiente al tipo_cuota desde la tabla precio_cuota
		const precioResult = await pool.query(
			'SELECT monto FROM precio_cuota WHERE nombre = $1',
			[tipo_cuota]
		);
		const monto = precioResult.rows[0].monto;

		// Insertar la cuota en la tabla cuotas
		await pool.query(
			'INSERT INTO cuotas (alumno_id, monto, fecha_pago, tipo_cuota) VALUES ($1, $2, CURRENT_DATE, $3)',
			[alumnoId, monto, tipo_cuota]
		);

		res
			.status(200)
			.json({ mensaje: 'Inscripción exitosa. El alumno ha sido registrado.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
	}
};

const actualizarAdeudores = async (req, res) => {
	try {
		// Actualizar alumnos con más de 30 días de diferencia entre fecha_pago y la fecha actual
		await pool.query(`
        UPDATE alumnos
        SET adeuda = true
        WHERE adeuda = false AND id IN (
            SELECT alumno_id
            FROM cuotas
            WHERE fecha_pago < CURRENT_DATE - INTERVAL '30 days'
        )
    `);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al actualizar alumnos deudores');
	}
};

const getAlumnosDeudores = async (req, res) => {
	try {
		await actualizarAdeudores(); // Actualizar los alumnos que tienen deudas
		// Obtener alumnos que tienen adeuda = true
		const result = await pool.query(`
            SELECT nombre, apellido, telefono
            FROM alumnos 
            WHERE adeuda = true
        `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener alumnos adeudadores');
	}
};
const getAlumnoByDNI = async (req, res) => {
	const dni = req.params.dni;
	try {
		const result = await pool.query('SELECT * FROM alumnos WHERE dni = $1', [
			dni,
		]);
		const alumno = result.rows[0];

		if (!alumno) {
			return res.status(404).json({ mensaje: 'Alumno no encontrado' });
		}
		res.json(alumno);
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al obtener el alumno por DNI' });
	}
};
const agregarDiaExtra = async (req, res) => {
	try {
		//Actualizar la fecha de pago de la última cuota de cada alumno
		await pool.query(`
        WITH ultimas_cuotas AS (
          SELECT DISTINCT ON (alumno_id) id
          FROM cuotas
          ORDER BY alumno_id, fecha_pago DESC
        )
        UPDATE cuotas
        SET fecha_pago = fecha_pago + INTERVAL '1 day'
        WHERE id IN (SELECT id FROM ultimas_cuotas);
      `);
		await actualizarAdeudores(); // Actualizar los alumnos que tienen deudas
		res.status(200).json({
			mensaje: 'Se ha agregado un día extra a las cuotas de todos los alumnos',
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al agregar un día extra a las cuotas');
	}
};

module.exports = {
	getAlumnos,
	inscribirAlumno,
	getAlumnosDeudores,
	getAlumnoByDNI,
	registrarAsistencia,
	agregarDiaExtra,
};
