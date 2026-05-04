const db = require('../config/database');

class Exercise {
  /**
   * Obtener todos los ejercicios
   */
  static async findAll(offset = 0, limit = 20) {
    const [rows] = await db.query('SELECT * FROM ejercicios LIMIT ? OFFSET ?', [limit, offset]);
    return rows;
  }

  /**
   * Obtener ejercicio por ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Crear un nuevo ejercicio
   */
  static async create(exerciseData) {
    const query = `INSERT INTO ejercicios 
      (titulo, musculo_id, dificultad, descripcion, imagen, tipo, puntos_clave) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      exerciseData.titulo,
      exerciseData.musculo_id || 1,
      exerciseData.dificultad || 'Media',
      exerciseData.descripcion,
      exerciseData.imagen,
      exerciseData.tipo || 'Fuerza / Hipertrofia',
      exerciseData.puntos_clave || null
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

  /**
   * Actualizar ejercicio
   */
  static async update(id, exerciseData) {
    const query = `UPDATE ejercicios SET 
      titulo = ?, musculo_id = ?, dificultad = ?, descripcion = ?, imagen = ?, tipo = ?, puntos_clave = ? 
      WHERE id = ?`;
    
    const values = [
      exerciseData.titulo,
      exerciseData.musculo_id || 1,
      exerciseData.dificultad || 'Media',
      exerciseData.descripcion || null,
      exerciseData.imagen || null,
      exerciseData.tipo || 'Fuerza / Hipertrofia',
      exerciseData.puntos_clave || null,
      id
    ];

    await db.query(query, values);
    return true;
  }

  /**
   * Eliminar ejercicio
   */
  static async delete(id) {
    await db.query('DELETE FROM ejercicios WHERE id = ?', [id]);
    return true;
  }

  /**
   * Contar total de ejercicios
   */
  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM ejercicios');
    return rows[0].total;
  }
}

module.exports = Exercise;