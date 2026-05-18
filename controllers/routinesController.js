const db = require('../config/database');

exports.getUserRoutines = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const [routines] = await db.query('SELECT * FROM rutinas WHERE id_usuario = ? ORDER BY created_at DESC', [id_usuario]);

    // For each routine, fetch exercises
    const routinesWithExercises = await Promise.all(routines.map(async (r) => {
      const [exs] = await db.query(`
        SELECT re.*, e.titulo, e.imagen, e.tipo
        FROM rutina_ejercicios re
        JOIN ejercicios e ON re.id_ejercicio = e.id
        WHERE re.id_rutina = ?
        ORDER BY re.orden ASC
      `, [r.id]);
      return { ...r, ejercicios: exs };
    }));

    res.json(routinesWithExercises);
  } catch (error) {
    console.error('Error getUserRoutines:', error);
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
};

exports.createRoutine = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { nombre, descripcion, dias_semana, nivel } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

    const [result] = await db.query('INSERT INTO rutinas (id_usuario, nombre, descripcion, dias_semana, nivel) VALUES (?, ?, ?, ?, ?)', [id_usuario, nombre, descripcion || null, dias_semana || null, nivel || 'Media']);
    const [rows] = await db.query('SELECT * FROM rutinas WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error createRoutine:', error);
    res.status(500).json({ error: 'Error al crear rutina' });
  }
};

exports.getRoutineById = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM rutinas WHERE id = ? AND id_usuario = ?', [id, id_usuario]);
    if (!rows.length) return res.status(404).json({ error: 'Rutina no encontrada' });
    const routine = rows[0];
    const [exs] = await db.query(`SELECT re.*, e.titulo, e.imagen FROM rutina_ejercicios re JOIN ejercicios e ON re.id_ejercicio = e.id WHERE re.id_rutina = ? ORDER BY re.orden ASC`, [id]);
    routine.ejercicios = exs;
    res.json(routine);
  } catch (error) {
    console.error('Error getRoutineById:', error);
    res.status(500).json({ error: 'Error al obtener rutina' });
  }
};

exports.addExerciseToRoutine = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id_rutina = req.params.id;
    const { id_ejercicio, series, repeticiones, peso_objetivo, descanso_segundos, orden } = req.body;

    // Verify ownership
    const [rrows] = await db.query('SELECT id FROM rutinas WHERE id = ? AND id_usuario = ?', [id_rutina, id_usuario]);
    if (!rrows.length) return res.status(403).json({ error: 'No tienes permiso sobre esta rutina' });

    const [result] = await db.query('INSERT INTO rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, peso_objetivo, descanso_segundos, orden) VALUES (?, ?, ?, ?, ?, ?, ?)', [id_rutina, id_ejercicio, series || 3, repeticiones || '10-12', peso_objetivo || null, descanso_segundos || 60, orden || 0]);
    const [rows] = await db.query('SELECT re.*, e.titulo, e.imagen FROM rutina_ejercicios re JOIN ejercicios e ON re.id_ejercicio = e.id WHERE re.id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error addExerciseToRoutine:', error);
    res.status(500).json({ error: 'Error al añadir ejercicio' });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id = req.params.id;
    // Ensure the exercise belongs to a routine of the user
    const [rows] = await db.query('SELECT r.id_usuario FROM rutina_ejercicios re JOIN rutinas r ON re.id_rutina = r.id WHERE re.id = ?', [id]);
    if (!rows.length || rows[0].id_usuario !== id_usuario) return res.status(403).json({ error: 'No tienes permiso' });
    await db.query('DELETE FROM rutina_ejercicios WHERE id = ?', [id]);
    res.json({ message: 'Ejercicio eliminado' });
  } catch (error) {
    console.error('Error deleteExercise:', error);
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
};

exports.deleteRoutine = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id = req.params.id;
    await db.query('DELETE FROM rutinas WHERE id = ? AND id_usuario = ?', [id, id_usuario]);
    res.json({ message: 'Rutina eliminada' });
  } catch (error) {
    console.error('Error deleteRoutine:', error);
    res.status(500).json({ error: 'Error al eliminar rutina' });
  }
};
