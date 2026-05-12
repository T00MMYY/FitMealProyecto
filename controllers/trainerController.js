const db = require('../config/database');

// Obtener el entrenador asignado al usuario actual
exports.getMyTrainer = async (req, res) => {
  try {
    const id_cliente = req.user.id_usuario;
    
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email, u.foto_url, u.foto
      FROM usuarios u
      JOIN entrenador_cliente ec ON u.id_usuario = ec.id_entrenador
      WHERE ec.id_cliente = ? AND ec.estado = 'activo'
    `, [id_cliente]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No tienes un entrenador asignado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error en getMyTrainer:", error);
    res.status(500).json({ error: 'Error al obtener tu entrenador' });
  }
};

// Obtener la lista de todos los entrenadores disponibles (id_rol = 4)
exports.getAvailableTrainers = async (req, res) => {
  try {
    const [trainers] = await db.query(`
      SELECT id_usuario, nombre, apellidos, email, foto_url, foto
      FROM usuarios
      WHERE id_rol = 4
    `);

    res.json(trainers);
  } catch (error) {
    console.error("Error en getAvailableTrainers:", error);
    res.status(500).json({ error: 'Error al obtener entrenadores' });
  }
};

// Asignar un entrenador a un cliente (Solo Admin)
exports.assignTrainer = async (req, res) => {
  try {
    const { id_cliente, id_entrenador } = req.body;

    if (!id_cliente || !id_entrenador) {
      return res.status(400).json({ error: 'Faltan datos de asignación.' });
    }

    // Verificar si el usuario ya tiene un entrenador asignado, si es así, se desactiva o se actualiza
    await db.query(`
      UPDATE entrenador_cliente 
      SET estado = 'inactivo' 
      WHERE id_cliente = ? AND estado = 'activo'
    `, [id_cliente]);

    // Insertar la nueva asignación
    await db.query(`
      INSERT INTO entrenador_cliente (id_entrenador, id_cliente, estado) 
      VALUES (?, ?, 'activo')
      ON DUPLICATE KEY UPDATE estado = 'activo', fecha_asignacion = CURRENT_TIMESTAMP
    `, [id_entrenador, id_cliente]);

    res.json({ message: 'Entrenador asignado con éxito.' });
  } catch (error) {
    console.error("Error en assignTrainer:", error);
    res.status(500).json({ error: 'Error al asignar el entrenador.' });
  }
};
