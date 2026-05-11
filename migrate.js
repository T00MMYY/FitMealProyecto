require('dotenv').config();
const db = require('./config/database');

async function migrate() {
  try {
    // 1. Añadir el rol de entrenador si no existe
    await db.query(`INSERT IGNORE INTO roles (id_rol, nombre, descripcion) VALUES 
      (4, 'entrenador', 'Entrenador con acceso a funciones avanzadas')
    `);

    // 2. Insertar planes de suscripción si están vacíos
    await db.query(`INSERT IGNORE INTO planes_suscripcion (id_plan, nombre_plan, descripcion, precio_mensual, duracion_dias, caracteristicas, estado) VALUES
      (1, 'Plan Básico', 'Acceso básico a la plataforma', 9.99, 30, 'Acceso a recetas básicas, Plan nutricional simple', 'activo'),
      (2, 'Plan Premium', 'Acceso completo con seguimiento personalizado', 29.99, 30, 'Todas las recetas, Plan personalizado, Seguimiento por nutricionista, Descuentos en productos', 'activo')
    `);

    // 3. Crear tabla entrenador_cliente
    await db.query(`
      CREATE TABLE IF NOT EXISTS entrenador_cliente (
        id_entrenador int NOT NULL,
        id_cliente int NOT NULL,
        estado varchar(20) DEFAULT 'activo',
        fecha_asignacion timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id_entrenador, id_cliente),
        FOREIGN KEY (id_entrenador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Migración completada!');
    process.exit(0);
  } catch (err) {
    console.error('Error en migración:', err);
    process.exit(1);
  }
}

migrate();
