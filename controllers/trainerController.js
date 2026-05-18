const db = require('../config/database');

// Obtener el entrenador asignado al usuario actual
exports.getMyTrainer = async (req, res) => {
  try {
    const id_cliente = req.user.id_usuario;
    
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email
      FROM usuarios u
      JOIN entrenador_cliente ec ON u.id_usuario = ec.id_entrenador
      WHERE ec.id_cliente = ? AND ec.estado = 'activo'
    `, [id_cliente]);

    // CORREGIDO: Si no hay filas, devolvemos un estado exitoso (200) pero informando que no tiene
    if (rows.length === 0) {
      return res.status(200).json({ hasTrainer: false, trainer: null });
    }

    // Si tiene, devolvemos los datos estructurados
    res.json({ hasTrainer: true, trainer: rows[0] });
  } catch (error) {
    console.error("Error en getMyTrainer:", error);
    res.status(500).json({ error: 'Error al obtener tu entrenador' });
  }
};

// Obtener la lista de todos los entrenadores disponibles (id_rol = 4)
exports.getAvailableTrainers = async (req, res) => {
  try {
    const [trainers] = await db.query(`
      SELECT id_usuario, nombre, apellidos, email
      FROM usuarios
      WHERE id_rol = 4
    `);

    res.json(trainers);
  } catch (error) {
    console.error("Error en getAvailableTrainers:", error);
    res.status(500).json({ error: 'Error al obtener entrenadores' });
  }
};

// Obtener los clientes del entrenador actual
exports.getMyClients = async (req, res) => {
  try {
    const id_entrenador = req.user.id_usuario;
    const [clients] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email, u.peso, u.objetivo, ec.fecha_asignacion
      FROM usuarios u
      JOIN entrenador_cliente ec ON u.id_usuario = ec.id_cliente
      WHERE ec.id_entrenador = ? AND ec.estado = 'activo'
    `, [id_entrenador]);
    
    res.json(clients);
  } catch (error) {
    console.error("Error en getMyClients:", error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Asignar un ejercicio a un cliente (Solo Entrenador)
exports.assignExerciseToClient = async (req, res) => {
  try {
    const id_entrenador = req.user.id_usuario;
    const { id_cliente, id_ejercicio, series, repeticiones, notas, dia_semana } = req.body;

    // Verificar que el cliente pertenece a este entrenador
    const [check] = await db.query(`
      SELECT 1 FROM entrenador_cliente 
      WHERE id_entrenador = ? AND id_cliente = ? AND estado = 'activo'
    `, [id_entrenador, id_cliente]);

    if (check.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para asignar a este cliente.' });
    }

    await db.query(`
      INSERT INTO rutinas_asignadas (id_entrenador, id_cliente, id_ejercicio, series, repeticiones, notas, dia_semana)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id_entrenador, id_cliente, id_ejercicio, series || 3, repeticiones || '10-12', notas || '', dia_semana || 'General']);

    res.json({ message: 'Ejercicio asignado a la rutina.' });
  } catch (error) {
    console.error("Error en assignExercise:", error);
    res.status(500).json({ error: 'Error al asignar ejercicio' });
  }
};

// Obtener la rutina de un cliente (Para el Entrenador o el Cliente)
exports.getClientRoutine = async (req, res) => {
  try {
    const id_cliente = req.params.id; // Puede ser el propio cliente o su entrenador
    
    const [rutina] = await db.query(`
      SELECT ra.id_rutina, ra.series, ra.repeticiones, ra.notas, ra.fecha_asignacion, ra.dia_semana,
             e.id, e.titulo, e.imagen, e.dificultad, e.tipo
      FROM rutinas_asignadas ra
      JOIN ejercicios e ON ra.id_ejercicio = e.id
      WHERE ra.id_cliente = ?
      ORDER BY ra.fecha_asignacion DESC
    `, [id_cliente]);

    res.json(rutina);
  } catch (error) {
    console.error("Error en getClientRoutine:", error);
    res.status(500).json({ error: 'Error al obtener rutina' });
  }
};

// Eliminar un ejercicio asignado (Solo Entrenador)
exports.deleteAssignedExercise = async (req, res) => {
  try {
    const id_rutina = req.params.id;
    const id_entrenador = req.user.id_usuario;

    await db.query(`
      DELETE FROM rutinas_asignadas
      WHERE id_rutina = ? AND id_entrenador = ?
    `, [id_rutina, id_entrenador]);

    res.json({ message: 'Ejercicio eliminado de la rutina.' });
  } catch (error) {
    console.error("Error en deleteAssignedExercise:", error);
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
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

// Guardar progreso/peso de un ejercicio en el historial
exports.logWorkout = async (req, res) => {
  try {
    const id_cliente = req.user.id_usuario;
    const { id_rutina, completado, peso_kg, series_data, fecha } = req.body;
    
    // Si la fecha no viene, usar hoy local
    const logDate = fecha || new Date().toISOString().split('T')[0];

    // Upsert (Insert or Update)
    await db.query(`
      INSERT INTO historial_rutinas (id_cliente, id_rutina, fecha, peso_kg, series_data, completado)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE peso_kg = VALUES(peso_kg), series_data = VALUES(series_data), completado = VALUES(completado)
    `, [id_cliente, id_rutina, logDate, peso_kg || 0, JSON.stringify(series_data || []), completado]);

    res.json({ message: 'Progreso guardado.' });
  } catch (error) {
    console.error("Error en logWorkout:", error);
    res.status(500).json({ error: 'Error al guardar progreso' });
  }
};

// Obtener los ejercicios completados en una fecha específica
exports.getTodayProgress = async (req, res) => {
  try {
    const id_cliente = req.user.id_usuario;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const [logs] = await db.query(`
      SELECT id_rutina, completado, peso_kg, series_data
      FROM historial_rutinas
      WHERE id_cliente = ? AND fecha = ?
    `, [id_cliente, date]);

    res.json(logs);
  } catch (error) {
    console.error("Error en getTodayProgress:", error);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
};
