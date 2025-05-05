const pool = require('../db');

const getCuotas = async (req, res) => {
	try {
		const result = await pool.query(` SELECT * FROM precio_cuota`);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener cuotas');
	}
};
const modificarCuotas = async (req, res) => {
	const cambios = req.body;

	// Validar que los datos sean un array y que cada elemento tenga un id y un monto válido
	if (
		!Array.isArray(cambios) ||
		cambios.some(
			(cambio) => !cambio.id || isNaN(cambio.monto) || cambio.monto < 0
		)
	) {
		return res
			.status(400)
			.json({ mensaje: 'Datos inválidos. Verifica los valores ingresados.' });
	}

	try {
		// Actualizar cada cuota en la base de datos
		for (const cambio of cambios) {
			await pool.query('UPDATE precio_cuota SET monto = $1 WHERE id = $2', [
				cambio.monto,
				cambio.id,
			]);
		}
		res.status(200).json({ mensaje: 'Cuotas modificadas correctamente.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al modificar cuotas.' });
	}
};

module.exports = {
	getCuotas,
	modificarCuotas,
};
