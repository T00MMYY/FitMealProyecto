const db = require('../config/database');

const logAction = async (usuario_id, accion, detalles) => {
  try {
    await db.query('INSERT INTO logs (usuario_id, accion, detalles, fecha) VALUES (?, ?, ?, NOW())', [usuario_id, accion, detalles]);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

module.exports = { logAction };