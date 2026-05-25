const db = require('../config/database');

class Product {
  static async findAll() {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias_productos c ON p.id_categoria = c.id_categoria
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = Product;
