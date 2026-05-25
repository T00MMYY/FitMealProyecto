const Product = require('../models/Product');

class ProductController {
  static async getAllProducts(peticion, respuesta) {
    try {
      const listaProductos = await Product.findAll();
      respuesta.json({ products: listaProductos });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      respuesta.status(500).json({
        error: 'Error al obtener productos',
        ...(process.env.NODE_ENV !== 'production' && { details: error.message })
      });
    }
  }

  static async getProductById(peticion, respuesta) {
    try {
      const idProducto = peticion.params.id;
      const producto = await Product.findById(idProducto);

      if (!producto) {
        return respuesta.status(404).json({ message: 'Producto no encontrado' });
      }

      respuesta.json({ product: producto });
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      respuesta.status(500).json({
        error: 'Error al obtener el producto',
        ...(process.env.NODE_ENV !== 'production' && { details: error.message })
      });
    }
  }
}

module.exports = ProductController;
