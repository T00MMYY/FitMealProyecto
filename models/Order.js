const db = require('../config/database');

const PRICE_BY_CATEGORY_AND_FORMAT = {
  5: {
    '500g': 24.99,
    '2kg': 41.99,
    '5kg': 89.99,
  },
  6: {
    '30 caps': 9.99,
    '60 caps': 17.99,
    '90 caps': 24.99,
    '180 caps': 44.99,
  },
  7: {
    '1 ud': 2.49,
    'Caja 6': 13.99,
    'Caja 12': 25.99,
    'Caja 24': 47.99,
  },
};

function unitPriceFor(product, formato) {
  const formatPrices = PRICE_BY_CATEGORY_AND_FORMAT[Number(product.id_categoria)] || {};
  return Number(formatPrices[formato] ?? product.precio);
}

class Order {
  static async create({ id_usuario, items, direccion_envio }) {
    const normalizedItems = items.map((item) => ({
      id_producto: Number(item.id_producto ?? item.id),
      cantidad: Number(item.cantidad),
      formato: item.formato || item.talla || null,
    }));

    const ids = [...new Set(normalizedItems.map((item) => item.id_producto))];
    const [products] = await db.query(
      `SELECT id_producto, nombre_producto, precio, stock, id_categoria, imagen_url, estado
       FROM productos
       WHERE id_producto IN (?)`,
      [ids]
    );

    const productsById = new Map(products.map((product) => [Number(product.id_producto), product]));
    const orderItems = normalizedItems.map((item) => {
      const product = productsById.get(item.id_producto);

      if (!product || product.estado !== 'disponible') {
        throw new Error('Producto no disponible');
      }

      if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
        throw new Error('Cantidad invalida');
      }

      if (Number(product.stock) < item.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre_producto}`);
      }

      const precio_unitario = unitPriceFor(product, item.formato);
      const subtotal = Number((precio_unitario * item.cantidad).toFixed(2));

      return {
        ...item,
        nombre_producto: product.nombre_producto,
        imagen_url: product.imagen_url,
        precio_unitario,
        subtotal,
      };
    });

    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    const envio = subtotal >= 49 ? 0 : 4.99;
    const total = Number((subtotal + envio).toFixed(2));

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.query(
        `INSERT INTO pedidos (id_usuario, total, estado, direccion_envio, metodo_pago)
         VALUES (?, ?, 'pagado', ?, 'tarjeta')`,
        [id_usuario, total, direccion_envio]
      );

      const id_pedido = orderResult.insertId;

      for (const item of orderItems) {
        await connection.query(
          `INSERT INTO detalle_pedidos
             (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [id_pedido, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
        );

        await connection.query(
          `UPDATE productos
           SET stock = stock - ?
           WHERE id_producto = ?`,
          [item.cantidad, item.id_producto]
        );
      }

      await connection.commit();

      return {
        id_pedido,
        subtotal,
        envio,
        total,
        estado: 'pagado',
        items: orderItems,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

//modelo
  static async findAll() {
    const [orders] = await db.query(
      `SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, p.direccion_envio,
              u.nombre, u.email
       FROM pedidos p
       JOIN usuarios u ON u.id_usuario = p.id_usuario
       ORDER BY p.fecha_pedido DESC`
    );
    return orders;
  }

  static async findByUser(id_usuario) {
    const [orders] = await db.query(
      `SELECT id_pedido, fecha_pedido, total, estado, metodo_pago
       FROM pedidos
       WHERE id_usuario = ?
       ORDER BY fecha_pedido DESC`,
      [id_usuario]
    );

    return orders;
  }

  static async findByIdForUser(id_pedido, id_usuario) {
    const [orders] = await db.query(
      `SELECT id_pedido, fecha_pedido, total, estado, direccion_envio, metodo_pago
       FROM pedidos
       WHERE id_pedido = ? AND id_usuario = ?`,
      [id_pedido, id_usuario]
    );

    if (orders.length === 0) {
      return null;
    }

    const [items] = await db.query(
      `SELECT d.id_detalle, d.cantidad, d.precio_unitario, d.subtotal,
              p.id_producto, p.nombre_producto, p.imagen_url
       FROM detalle_pedidos d
       JOIN productos p ON p.id_producto = d.id_producto
       WHERE d.id_pedido = ?
       ORDER BY d.id_detalle ASC`,
      [id_pedido]
    );

    return {
      ...orders[0],
      items,
    };
  }
}

module.exports = Order;
