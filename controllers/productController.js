const Product = require('../models/Product');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 20);
      const offset = (page - 1) * limit;

      const products = await Product.findAll(offset, limit);
      res.json({ products, page, limit });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        error: 'Error al obtener productos',
        ...(process.env.NODE_ENV !== 'production' && { details: error.message })
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json({ product });
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({
        error: 'Error al obtener el producto',
        ...(process.env.NODE_ENV !== 'production' && { details: error.message })
      });
    }
  }
}

module.exports = ProductController;
