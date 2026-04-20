const db = require('../config/database');

class Recipe {
  /**
   * Obtener todas las recetas
   */
  static async findAll(offset = 0, limit = 20) {
    const [rows] = await db.query('SELECT * FROM recetas LIMIT ? OFFSET ?', [limit, offset]);
    return rows;
  }

  /**
   * Obtener receta por ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM recetas WHERE id_receta = ?', [id]);
    return rows[0];
  }

  /**
   * Crear una nueva receta
   */
  static async create(recipeData) {
    const query = `INSERT INTO recetas 
      (titulo, descripcion, instrucciones, tiempo_preparacion, dificultad, calorias, proteinas, carbohidratos, grasas, imagen, id_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      recipeData.titulo,
      recipeData.descripcion,
      recipeData.instrucciones,
      recipeData.tiempo_preparacion,
      recipeData.dificultad,
      recipeData.calorias,
      recipeData.proteinas,
      recipeData.carbohidratos,
      recipeData.grasas,
      recipeData.imagen,
      recipeData.id_usuario
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

  /**
   * Actualizar receta
   */
  static async update(id, recipeData) {
    const query = `UPDATE recetas SET 
      titulo = ?, descripcion = ?, instrucciones = ?, tiempo_preparacion = ?, dificultad = ?, 
      calorias = ?, proteinas = ?, carbohidratos = ?, grasas = ?, imagen = ? 
      WHERE id_receta = ?`;
    
    const values = [
      recipeData.titulo,
      recipeData.descripcion,
      recipeData.instrucciones,
      recipeData.tiempo_preparacion,
      recipeData.dificultad,
      recipeData.calorias,
      recipeData.proteinas,
      recipeData.carbohidratos,
      recipeData.grasas,
      recipeData.imagen,
      id
    ];

    await db.query(query, values);
    return true;
  }

  /**
   * Eliminar receta
   */
  static async delete(id) {
    await db.query('DELETE FROM recetas WHERE id_receta = ?', [id]);
    return true;
  }

  /**
   * Contar total de recetas
   */
  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM recetas');
    return rows[0].total;
  }
}

module.exports = Recipe;