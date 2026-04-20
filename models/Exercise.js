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
    const [rows] = await db.query('SELECT * FROM ejercicios WHERE id_ejercicio = ?', [id]);
    return rows[0];
  }

  /**
   * Crear un nuevo ejercicio
   */
  static async create(exerciseData) {
    const query = `INSERT INTO ejercicios 
      (titulo, grupo_muscular, dificultad, descripcion, imagen, video_url) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    const values = [
      exerciseData.titulo,
      exerciseData.grupo_muscular,
      exerciseData.dificultad,
      exerciseData.descripcion,
      exerciseData.imagen,
      exerciseData.video_url
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

  /**
   * Actualizar ejercicio
   */
  static async update(id, exerciseData) {
    const query = `UPDATE ejercicios SET 
      titulo = ?, grupo_muscular = ?, dificultad = ?, descripcion = ?, imagen = ?, video_url = ? 
      WHERE id_ejercicio = ?`;
    
    const values = [
      exerciseData.titulo,
      exerciseData.grupo_muscular,
      exerciseData.dificultad,
      exerciseData.descripcion,
      exerciseData.imagen,
      exerciseData.video_url,
      id
    ];

    await db.query(query, values);
    return true;
  }

  /**
   * Eliminar ejercicio
   */
  static async delete(id) {
    await db.query('DELETE FROM ejercicios WHERE id_ejercicio = ?', [id]);
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