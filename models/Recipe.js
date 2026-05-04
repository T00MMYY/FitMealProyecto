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
      (titulo, calorias, proteina, tiempo, tipo, imagen, carbohidratos, grasas, ingredientes, instrucciones) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      recipeData.titulo,
      recipeData.calorias || 0,
      recipeData.proteina || recipeData.proteinas || 0,
      recipeData.tiempo || recipeData.tiempo_preparacion || 0,
      recipeData.tipo || 'General',
      recipeData.imagen || null,
      recipeData.carbohidratos || 0,
      recipeData.grasas || 0,
      recipeData.ingredientes || null,
      recipeData.instrucciones || null
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

  /**
   * Actualizar receta
   */
  static async update(id, recipeData) {
    const query = `UPDATE recetas SET 
      titulo = ?, calorias = ?, proteina = ?, tiempo = ?, tipo = ?, 
      imagen = ?, carbohidratos = ?, grasas = ?, ingredientes = ?, instrucciones = ? 
      WHERE id_receta = ?`;
    
    const values = [
      recipeData.titulo,
      recipeData.calorias || 0,
      recipeData.proteina || recipeData.proteinas || 0,
      recipeData.tiempo || recipeData.tiempo_preparacion || 0,
      recipeData.tipo || 'General',
      recipeData.imagen || null,
      recipeData.carbohidratos || 0,
      recipeData.grasas || 0,
      recipeData.ingredientes || null,
      recipeData.instrucciones || null,
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