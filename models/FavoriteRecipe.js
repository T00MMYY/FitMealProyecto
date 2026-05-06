const db = require('../config/database');

class FavoriteRecipe {
  /**
   * Obtener todas las recetas favoritas de un usuario
   */
  static async getUserFavorites(id_usuario) {
    const [rows] = await db.query(
      `SELECT r.* FROM recetas r
       JOIN favoritos_recetas fr ON r.id_receta = fr.id_receta
       WHERE fr.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }

  /**
   * Añadir una receta a favoritos
   */
  static async addFavorite(id_usuario, id_receta) {
    try {
      const [result] = await db.query(
        'INSERT INTO favoritos_recetas (id_usuario, id_receta) VALUES (?, ?)',
        [id_usuario, id_receta]
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
   * Quitar una receta de favoritos
   */
  static async removeFavorite(id_usuario, id_receta) {
    const [result] = await db.query(
      'DELETE FROM favoritos_recetas WHERE id_usuario = ? AND id_receta = ?',
      [id_usuario, id_receta]
    );
    return result.affectedRows > 0;
  }

  /**
   * Comprobar si una receta es favorita
   */
  static async isFavorite(id_usuario, id_receta) {
    const [rows] = await db.query(
      'SELECT 1 FROM favoritos_recetas WHERE id_usuario = ? AND id_receta = ?',
      [id_usuario, id_receta]
    );
    return rows.length > 0;
  }
}

module.exports = FavoriteRecipe;
