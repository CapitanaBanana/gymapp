const pool = require('./db');

const resetDatabase = async () => {
	try {
		await pool.query(`
		  DROP TABLE IF EXISTS ventas CASCADE;
      DROP TABLE IF EXISTS asistencias CASCADE;
      DROP TABLE IF EXISTS cuotas CASCADE;
      DROP TABLE IF EXISTS alumnos CASCADE;
      DROP TABLE IF EXISTS precio_cuota CASCADE;
      DROP TABLE IF EXISTS productos CASCADE;

			CREATE TABLE alumnos (
				id SERIAL PRIMARY KEY,
				nombre VARCHAR(100) NOT NULL,
				apellido VARCHAR(100) NOT NULL,
				dni VARCHAR(20) UNIQUE NOT NULL,
				email VARCHAR(150),
				telefono VARCHAR(20),
				fecha_alta DATE DEFAULT CURRENT_DATE,
        adeuda BOOLEAN DEFAULT FALSE,
				activo BOOLEAN DEFAULT TRUE
			);

			CREATE TABLE asistencias (
				id SERIAL PRIMARY KEY,
				alumno_id INTEGER REFERENCES alumnos(id) ON DELETE CASCADE,
				fecha DATE NOT NULL,
				hora TIME NOT NULL DEFAULT CURRENT_TIME
			);

      CREATE TABLE cuotas (
        id SERIAL PRIMARY KEY,
        alumno_id INTEGER REFERENCES alumnos(id) ON DELETE CASCADE,
        monto DECIMAL(10, 2) NOT NULL,
        fecha_pago DATE,
        tipo_cuota VARCHAR(10) NOT NULL
      );

      CREATE TABLE precio_cuota (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        monto DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL
      );
      
      CREATE TABLE ventas (
        id SERIAL PRIMARY KEY,
        producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
        cantidad INTEGER NOT NULL,
        fecha_venta DATE DEFAULT CURRENT_DATE
      );

      -- Insertar precios de cuota de prueba
      INSERT INTO precio_cuota (nombre, monto) 
      VALUES
        ('dos', 5000.00),
        ('tres', 7000.00),
        ('libre', 9000.00);
      

			-- Datos de prueba
			INSERT INTO alumnos (nombre, apellido, dni, email, telefono, adeuda)
			VALUES 
				('Juan', 'Pérez', '12345678', NULL, '11111111', FALSE),
				('María', 'Gómez', '87654321', 'maria@example.com', '22222222', FALSE),
				('Luis', 'Martínez', '11223344', 'luis@example.com', '33333333', FALSE);

        -- Insertar asistencias de prueba
			INSERT INTO asistencias (alumno_id, fecha, hora)
			VALUES 
				(1, '2025-04-20', '10:00'),
				(1, '2025-04-22', '11:00'),
				(2, '2025-04-21', '09:30'),
				(2, '2025-04-22', '10:15'),
				(3, '2025-04-19', '08:45'),
				(3, '2025-04-22', '09:00');

        -- Insertar cuotas de prueba
           INSERT INTO cuotas (alumno_id, monto, fecha_pago, tipo_cuota) VALUES
          (1, 5000.00, '2025-03-05', 'dos'),
          (2, 7000.00, '2025-04-10', 'tres'),
          (3, 9000.00, '2025-03-23', 'libre');

      -- Insertar productos de prueba
       INSERT INTO productos (nombre, precio) VALUES
        ('Producto 1', 100.00),
        ('Producto 2', 200.00),
        ('Producto 3', 300.00);
		`);

		console.log('✅ Base de datos reseteada y datos de prueba insertados.');
		process.exit();
	} catch (err) {
		console.error('❌ Error al resetear la base de datos:', err);
		process.exit(1);
	}
};

resetDatabase();
