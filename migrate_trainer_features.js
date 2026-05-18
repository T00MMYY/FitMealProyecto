const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'FitMealRoot123',
    database: process.env.DB_NAME || 'fitness_platform',
    port: process.env.DB_PORT || 3307
  });

  try {
    console.log("Iniciando migración de funcionalidades de Entrenador...");

    // 1. Añadir columna dia_semana a rutinas_asignadas
    try {
      await connection.query(`
        ALTER TABLE rutinas_asignadas 
        ADD COLUMN dia_semana VARCHAR(20) DEFAULT 'General'
      `);
      console.log("✅ Columna 'dia_semana' añadida a rutinas_asignadas.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("ℹ️ La columna 'dia_semana' ya existe.");
      } else {
        throw e;
      }
    }

    // 2. Crear tabla historial_rutinas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS historial_rutinas (
        id_historial INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT NOT NULL,
        id_rutina INT NOT NULL,
        fecha DATE NOT NULL,
        peso_kg DECIMAL(5,2) DEFAULT 0,
        peso_serie1 DECIMAL(5,2) DEFAULT 0,
        peso_serie2 DECIMAL(5,2) DEFAULT 0,
        peso_serie3 DECIMAL(5,2) DEFAULT 0,
        reps_serie1 INT DEFAULT 0,
        reps_serie2 INT DEFAULT 0,
        reps_serie3 INT DEFAULT 0,
        completado BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_rutina) REFERENCES rutinas_asignadas(id_rutina) ON DELETE CASCADE,
        UNIQUE KEY unq_historial (id_cliente, id_rutina, fecha)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ Tabla 'historial_rutinas' creada/verificada correctamente.");

    // 3. Añadir columnas de peso y repeticiones por serie si existen registros antiguos
    const seriesColumns = [
      { name: 'peso_serie1', type: 'DECIMAL(5,2) DEFAULT 0' },
      { name: 'peso_serie2', type: 'DECIMAL(5,2) DEFAULT 0' },
      { name: 'peso_serie3', type: 'DECIMAL(5,2) DEFAULT 0' },
      { name: 'reps_serie1', type: 'INT DEFAULT 0' },
      { name: 'reps_serie2', type: 'INT DEFAULT 0' },
      { name: 'reps_serie3', type: 'INT DEFAULT 0' },
      { name: 'series_data', type: 'JSON DEFAULT NULL' }
    ];
    for (const column of seriesColumns) {
      try {
        await connection.query(`ALTER TABLE historial_rutinas ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Columna '${column.name}' añadida a historial_rutinas.`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ La columna '${column.name}' ya existe.`);
        } else {
          throw e;
        }
      }
    }

    console.log("🚀 Migración de base de datos completada con éxito.");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  } finally {
    await connection.end();
  }
}

migrate();
