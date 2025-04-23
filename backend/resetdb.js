const pool = require('./db');

const resetDatabase = async () => {
	try {
		await pool.query(`
			DROP TABLE IF EXISTS asistencias;
			DROP TABLE IF EXISTS alumnos;

			CREATE TABLE alumnos (
				id SERIAL PRIMARY KEY,
				nombre VARCHAR(100) NOT NULL,
				apellido VARCHAR(100) NOT NULL,
				dni VARCHAR(20) UNIQUE NOT NULL,
				email VARCHAR(150),
				telefono VARCHAR(20),
				fecha_alta DATE DEFAULT CURRENT_DATE,
				activo BOOLEAN DEFAULT TRUE
			);

			CREATE TABLE asistencias (
				id SERIAL PRIMARY KEY,
				alumno_id INTEGER REFERENCES alumnos(id) ON DELETE CASCADE,
				fecha DATE NOT NULL,
				hora TIME NOT NULL DEFAULT CURRENT_TIME
			);

			-- Datos de prueba
			INSERT INTO alumnos (nombre, apellido, dni, email, telefono)
			VALUES 
				('Juan', 'Pérez', '12345678', NULL, '11111111'),
				('María', 'Gómez', '87654321', 'maria@example.com', '22222222'),
				('Luis', 'Martínez', '11223344', 'luis@example.com', '33333333');

        -- Insertar asistencias de prueba
			INSERT INTO asistencias (alumno_id, fecha, hora)
			VALUES 
				(1, '2025-04-20', '10:00'),
				(1, '2025-04-22', '11:00'),
				(2, '2025-04-21', '09:30'),
				(2, '2025-04-22', '10:15'),
				(3, '2025-04-19', '08:45'),
				(3, '2025-04-22', '09:00');
        CREATE TABLE cuotas (
	id SERIAL PRIMARY KEY,
	alumno_id INTEGER REFERENCES alumnos(id) ON DELETE CASCADE,
	monto DECIMAL(10, 2) NOT NULL,
	adeuda BOOLEAN DEFAULT FALSE,
	fecha_pago DATE,
	tipo_cuota VARCHAR(10) NOT NULL
);

        INSERT INTO cuotas (alumno_id, monto, adeuda, fecha_pago, tipo_cuota) VALUES
	(1, 5000.00, FALSE, '2025-04-05', 'dos'),
	(2, 7000.00, FALSE, '2025-04-10', 'tres'),
	(3, 9000.00, FALSE, '2025-04-02', 'libre');

		`);

		console.log('✅ Base de datos reseteada y datos de prueba insertados.');
		process.exit();
	} catch (err) {
		console.error('❌ Error al resetear la base de datos:', err);
		process.exit(1);
	}
};

resetDatabase();
