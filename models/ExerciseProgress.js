const db = require('../config/database');

class ExerciseProgress {
  /**
   * Obtener el progreso de un usuario para un ejercicio específico
   */
  static async getProgress(id_usuario, id_ejercicio) {
    const [rows] = await db.query(
      `SELECT * FROM progreso_ejercicios 
       WHERE id_usuario = ? AND id_ejercicio = ?
       ORDER BY fecha DESC`,
      [id_usuario, id_ejercicio]
    );
    return rows;
  }

  /**
   * Añadir un nuevo registro de peso/repeticiones
   */
  static async addProgress(id_usuario, id_ejercicio, peso, repeticiones) {
    const [result] = await db.query(
      'INSERT INTO progreso_ejercicios (id_usuario, id_ejercicio, peso, repeticiones) VALUES (?, ?, ?, ?)',
      [id_usuario, id_ejercicio, peso, repeticiones]
    );
    return result.insertId;
  }

  /**
   * Eliminar un registro de progreso
   */
  static async removeProgress(id_usuario, id_progreso) {
    const [result] = await db.query(
      'DELETE FROM progreso_ejercicios WHERE id_usuario = ? AND id_progreso = ?',
      [id_usuario, id_progreso]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ExerciseProgress;
