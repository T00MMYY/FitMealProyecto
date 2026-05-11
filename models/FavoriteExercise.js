const db = require('../config/database');

class FavoriteExercise {
  /**
   * Obtener todos los ejercicios favoritos de un usuario
   */
  static async getUserFavorites(id_usuario) {
    const [rows] = await db.query(
      `SELECT e.* FROM ejercicios e
       JOIN favoritos_ejercicios fe ON e.id = fe.id_ejercicio
       WHERE fe.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }

  /**
   * Añadir un ejercicio a favoritos
   */
  static async addFavorite(id_usuario, id_ejercicio) {
    try {
      const [result] = await db.query(
        'INSERT INTO favoritos_ejercicios (id_usuario, id_ejercicio) VALUES (?, ?)',
        [id_usuario, id_ejercicio]
      );
      return result.affectedRows > 0;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return true; // Ya estaba en favoritos
      }
      throw error;
    }
  }

  /**
   * Quitar un ejercicio de favoritos
   */
  static async removeFavorite(id_usuario, id_ejercicio) {
    const [result] = await db.query(
      'DELETE FROM favoritos_ejercicios WHERE id_usuario = ? AND id_ejercicio = ?',
      [id_usuario, id_ejercicio]
    );
    return result.affectedRows > 0;
  }

  /**
   * Comprobar si un ejercicio es favorito
   */
  static async isFavorite(id_usuario, id_ejercicio) {
    const [rows] = await db.query(
      'SELECT 1 FROM favoritos_ejercicios WHERE id_usuario = ? AND id_ejercicio = ?',
      [id_usuario, id_ejercicio]
    );
    return rows.length > 0;
  }
}

module.exports = FavoriteExercise;
