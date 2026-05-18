const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitness_platform',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('Iniciando migración: rutinas y rutina_ejercicios...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS rutinas (
        id INT NOT NULL AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT DEFAULT NULL,
        dias_semana VARCHAR(100) DEFAULT NULL,
        nivel ENUM('Baja','Media','Alta') DEFAULT 'Media',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_rutina_usuario (id_usuario),
        CONSTRAINT fk_rutina_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS rutina_ejercicios (
        id INT NOT NULL AUTO_INCREMENT,
        id_rutina INT NOT NULL,
        id_ejercicio INT NOT NULL,
        series INT NOT NULL DEFAULT 3,
        repeticiones VARCHAR(50) NOT NULL DEFAULT '10-12',
        peso_objetivo DECIMAL(8,2) DEFAULT NULL,
        descanso_segundos INT DEFAULT 60,
        orden INT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY fk_re_rutina (id_rutina),
        KEY fk_re_ejercicio (id_ejercicio),
        CONSTRAINT fk_re_rutina FOREIGN KEY (id_rutina) REFERENCES rutinas(id) ON DELETE CASCADE,
        CONSTRAINT fk_re_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Migración de rutinas completada.');
  } catch (err) {
    console.error('Error en migración de rutinas:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
