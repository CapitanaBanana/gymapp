const pool = require('../db');

const getVentas = async (req, res) => {
	try {
		const result = await pool.query(`
      SELECT v.*, p.nombre AS nombre_producto
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
    `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al obtener las ventas' });
	}
};
const agregarVenta = async (req, res) => {
	const ventas = req.body; // Espera un array de objetos { producto_id, cantidad }
	if (!Array.isArray(ventas) || ventas.length === 0) {
		return res
			.status(400)
			.json({ mensaje: 'Debes enviar un array de ventas.' });
	}
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		for (const venta of ventas) {
			const { producto_id, cantidad } = venta;
			if (!producto_id || !cantidad) {
				await client.query('ROLLBACK');
				return res
					.status(400)
					.json({ mensaje: 'Faltan datos en alguna venta.' });
			}
			await client.query(
				`INSERT INTO ventas (producto_id, cantidad, fecha_venta) VALUES ($1, $2, NOW())`,
				[producto_id, cantidad]
			);
		}
		await client.query('COMMIT');
		res.status(201).json({ mensaje: 'Ventas agregadas correctamente' });
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
		res.status(500).json({ mensaje: 'Error al agregar las ventas' });
	} finally {
		client.release();
	}
};

const eliminarVenta = async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query(
			`
      DELETE FROM ventas
      WHERE id = $1
    `,
			[id]
		);
		res.status(200).json({ mensaje: 'Venta eliminada' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al eliminar la venta' });
	}
};

const getVentasAcumuladas = async (req, res) => {
	try {
		const result = await pool.query(`
      SELECT 
        DATE(fecha_venta) AS fecha,
        SUM(cantidad) AS total_ventas
      FROM ventas
      GROUP BY fecha
      ORDER BY fecha DESC
    `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al obtener las ventas acumuladas' });
	}
};

const getVentasHoy = async (req, res) => {
	try {
		const result = await pool.query(`
          SELECT 
              p.nombre AS nombre_producto,
              v.cantidad
          FROM ventas v
          JOIN productos p ON v.producto_id = p.id
          WHERE DATE(v.fecha_venta) = CURRENT_DATE
          ORDER BY v.id DESC
      `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al obtener las ventas de hoy' });
	}
};

module.exports = {
	getVentas,
	agregarVenta,
	eliminarVenta,
	getVentasHoy,
};
