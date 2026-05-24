const nodemailer = require('nodemailer');
const Order = require('../models/Order');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function formatCurrency(value) {
  return `${Number(value).toFixed(2)} EUR`;
}

async function sendOrderEmail({ to, order }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !to) {
    return false;
  }

  const rows = order.items
    .map((item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #242424;">
          <strong>${item.nombre_producto}</strong><br>
          <span style="color: #888;">${item.formato || 'Producto'} x ${item.cantidad}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #242424; text-align: right;">
          ${formatCurrency(item.subtotal)}
        </td>
      </tr>
    `)
    .join('');

  await transporter.sendMail({
    from: `"FitMeal" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Pedido realizado correctamente - FM-${String(order.id_pedido).padStart(6, '0')}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #D30F15; font-style: italic; margin: 0 0 8px;">FITMEAL</h1>
        <h2 style="margin: 0 0 12px;">Pedido realizado correctamente</h2>
        <p style="color: #bbb; margin: 0 0 24px;">Tu pedido <strong>FM-${String(order.id_pedido).padStart(6, '0')}</strong> se ha registrado correctamente.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${rows}
        </table>
        <p style="color: #bbb; margin: 0 0 6px;">Envio: ${formatCurrency(order.envio)}</p>
        <p style="font-size: 22px; font-weight: 800; margin: 0;">Total: ${formatCurrency(order.total)}</p>
        <p style="color: #777; font-size: 12px; margin: 24px 0 0;">Gracias por comprar en FitMeal.</p>
      </div>
    `,
  });

  return true;
}

async function createOrder(req, res) {
  const id_usuario = req.user?.id_usuario || req.user?.id;

  if (!id_usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const { items, direccion_envio, email } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El pedido no tiene productos' });
  }

  if (!direccion_envio || direccion_envio.trim().length < 5) {
    return res.status(400).json({ error: 'Direccion de envio invalida' });
  }

  try {
    const order = await Order.create({
      id_usuario,
      items,
      direccion_envio: direccion_envio.trim(),
    });

    let emailSent = false;
    try {
      emailSent = await sendOrderEmail({
        to: email || req.user.email,
        order,
      });
    } catch (emailError) {
      console.error('Error enviando email de pedido:', emailError);
    }

    res.status(201).json({
      message: 'Pedido creado correctamente',
      order,
      emailSent,
    });
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: error.message || 'No se pudo crear el pedido' });
  }
}


//listar pedidos
async function listAllOrders(req, res) {
  try {
    const orders = await Order.findAll();
    res.json({ orders });
  } catch (error) {
    console.error('Error listando todos los pedidos:', error);
    res.status(500).json({ error: 'No se pudieron cargar los pedidos' });
  }
}

async function listMyOrders(req, res) {
  try {
    const id_usuario = req.user.id_usuario || req.user.id;
    const orders = await Order.findByUser(id_usuario);
    res.json({ orders });
  } catch (error) {
    console.error('Error listando pedidos:', error);
    res.status(500).json({ error: 'No se pudieron cargar los pedidos' });
  }
}

async function getMyOrder(req, res) {
  try {
    const id_usuario = req.user.id_usuario || req.user.id;
    const order = await Order.findByIdForUser(req.params.id, id_usuario);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({ error: 'No se pudo cargar el pedido' });
  }
}

module.exports = { createOrder, listAllOrders, listMyOrders, getMyOrder };
