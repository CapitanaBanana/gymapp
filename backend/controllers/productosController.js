const pool = require('../db');

const getProductos = async (req, res) => {
	try {
		const result = await pool.query(` SELECT * FROM productos`);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error al obtener los productos');
	}
};
const agregarProducto = async (req, res) => {
	const { nombre, precio } = req.body;

	// Validar que el nombre y el precio sean válidos
	if (!nombre || !precio || isNaN(precio) || precio < 0) {
		return res.status(400).json({
			mensaje: 'Datos inválidos. Verifica los valores ingresados.',
		});
	}
	try {
		await pool.query('INSERT INTO productos (nombre, precio) VALUES ($1, $2)', [
			nombre,
			precio,
		]);
		res.status(201).json({ mensaje: 'Producto agregado correctamente.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al agregar el producto.' });
	}
};
const eliminarProducto = async (req, res) => {
	const { id } = req.params;

	// Validar que el ID sea un número válido
	if (!id || isNaN(id)) {
		return res.status(400).json({ mensaje: 'ID inválido.' });
	}

	try {
		const result = await pool.query('DELETE FROM productos WHERE id = $1', [
			id,
		]);
		if (result.rowCount === 0) {
			return res.status(404).json({ mensaje: 'Producto no encontrado.' });
		}
		res.status(200).json({ mensaje: 'Producto eliminado correctamente.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al eliminar el producto.' });
	}
};

const modificarProductos = async (req, res) => {
	const cambios = req.body;

	// Validar que los datos sean un array y que cada elemento tenga un id y un precio válido
	if (
		!Array.isArray(cambios) ||
		cambios.some(
			(cambio) => !cambio.id || isNaN(cambio.precio) || cambio.precio < 0
		)
	) {
		return res
			.status(400)
			.json({ mensaje: 'Datos inválidos. Verifica los valores ingresados.' });
	}

	try {
		// Actualizar cada producto en la base de datos
		for (const cambio of cambios) {
			await pool.query('UPDATE productos SET precio = $1 WHERE id = $2', [
				cambio.precio,
				cambio.id,
			]);
		}
		res.status(200).json({ mensaje: 'Productos modificados correctamente.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensaje: 'Error al modificar productos.' });
	}
};

module.exports = {
	getProductos,
	modificarProductos,
	eliminarProducto,
	agregarProducto,
};
