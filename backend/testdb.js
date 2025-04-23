const pool = require('./db');

const testDatabase = async () => {
	try {
		await pool.query(`
        INSERT INTO cuotas (alumno_id, monto, adeuda, fecha_pago, tipo_cuota) VALUES
    (1, 5000.00, FALSE, '2025-03-05', 'dos'),
    (2, 7000.00, FALSE, '2025-04-10', 'tres'),
    (3, 9000.00, TRUE, '2025-03-23', 'libre');
		`);

		console.log('✅ Base de datos reformada con exito.');
		process.exit();
	} catch (err) {
		console.error('❌ Error al reformar la base de datos:', err);
		process.exit(1);
	}
};

testDatabase();
