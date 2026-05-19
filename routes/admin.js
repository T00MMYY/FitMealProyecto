const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Exercise = require('../models/Exercise');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/database');

// --- MIDDLEWARES ---3

// Verificar que el usuario sea administrador (id_rol === 1)
const requireAdmin = (req, res, next) => {
  const userRole = req.user?.id_rol || req.user?.rol;
  if (!userRole || Number(userRole) !== 1) {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// Aplicar seguridad a todas las rutas del archivo
router.use(verifyToken);
router.use(requireAdmin);

// --- DASHBOARD & ESTADÍSTICAS ---

router.get('/stats', async (req, res) => {
  try {
    // Estadísticas generales de usuarios
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN objetivo = 'perder_grasa' THEN 1 ELSE 0 END) as perder_grasa,
        SUM(CASE WHEN objetivo = 'ganar_musculo' THEN 1 ELSE 0 END) as ganar_musculo,
        SUM(CASE WHEN objetivo = 'mantenerse' THEN 1 ELSE 0 END) as mantener
      FROM usuarios
    `);

    // Crecimiento mensual
    const [userGrowth] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as registros 
      FROM usuarios 
      GROUP BY mes 
      ORDER BY mes
    `);

    // Últimos registros para vista rápida
    const [topRecipes] = await db.query(`
      SELECT titulo, id_receta FROM recetas ORDER BY id_receta DESC LIMIT 5
    `);

    const [topExercises] = await db.query(`
      SELECT titulo, id FROM ejercicios ORDER BY id DESC LIMIT 5
    `);

    const totalRecipes = await Recipe.count();
    const totalExercises = await Exercise.count();

    res.json({
      totalUsers: userStats[0].total_users,
      totalRecipes,
      totalExercises,
      objetivos: {
        perderGrasa: userStats[0].perder_grasa || 0,
        ganarMusculo: userStats[0].ganar_musculo || 0,
        mantener: userStats[0].mantener || 0
      },
      userGrowth,
      topRecipes,
      topExercises
    });
  } catch (error) {
    console.error('Error en DASHBOARD:', error);
    res.status(500).json({ error: 'Error al cargar estadísticas' });
  }
});

// --- GESTIÓN DE USUARIOS ---

router.get('/users', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const users = await User.findAll(offset, limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_rol } = req.body;
    await db.query('UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?', [id_rol, id]);
    res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error("DEBUG ROLE ERROR:", error);
    res.status(500).json({ error: 'Error al actualizar rol', details: error.message });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_cuenta } = req.body; // 'activo', 'baneado', etc.
    await db.query('UPDATE usuarios SET estado_cuenta = ? WHERE id_usuario = ?', [estado_cuenta, id]);
    res.json({ message: 'Estado de cuenta actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});


router.put('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id_usuario) {
      return res.status(400).json({ error: 'No puedes banearte a ti mismo' });
    }
    const [rows] = await db.query('SELECT estado_cuenta FROM usuarios WHERE id_usuario = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    const nuevoEstado = rows[0].estado_cuenta === 'baneado' ? 'activo' : 'baneado';
    await db.query('UPDATE usuarios SET estado_cuenta = ? WHERE id_usuario = ?', [nuevoEstado, id]);
    res.json({ message: nuevoEstado === 'baneado' ? 'Usuario baneado' : 'Usuario desbaneado', estado: nuevoEstado });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id_usuario) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    const deleted = await User.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// --- GESTIÓN DE RECETAS ---

router.get('/recipes', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const recipes = await Recipe.findAll(offset, limit);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

router.post('/recipes', async (req, res) => {
  try {
    const recipeData = { ...req.body, id_usuario: req.user.id_usuario };
    const id = await Recipe.create(recipeData);
    res.status(201).json({ id, message: 'Receta creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear receta' });
  }
});

router.put('/recipes/:id', async (req, res) => {
  try {
    await Recipe.update(req.params.id, req.body);
    res.json({ message: 'Receta actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar receta' });
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.delete(req.params.id);
    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar receta' });
  }
});

// --- GESTIÓN DE EJERCICIOS ---

router.get('/exercises', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const exercises = await Exercise.findAll(offset, limit);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
});

router.get('/trainers', async (req, res) => {
  try {
    const [trainers] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email,
             COUNT(ec.id_cliente) AS clientsCount
      FROM usuarios u
      LEFT JOIN entrenador_cliente ec ON u.id_usuario = ec.id_entrenador AND ec.estado = 'activo'
      WHERE u.id_rol = 4
      GROUP BY u.id_usuario
      ORDER BY clientsCount DESC, u.nombre ASC
    `);
    res.json(trainers);
  } catch (error) {
    console.error('Error al obtener entrenadores admin:', error);
    res.status(500).json({ error: 'Error al obtener entrenadores' });
  }
});

router.get('/trainers/:id/clients', async (req, res) => {
  try {
    const trainerId = parseInt(req.params.id, 10);
    if (!trainerId) {
      return res.status(400).json({ error: 'ID de entrenador inválido' });
    }

    const [clients] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email, u.peso, u.objetivo, ec.fecha_asignacion
      FROM usuarios u
      JOIN entrenador_cliente ec ON u.id_usuario = ec.id_cliente
      WHERE ec.id_entrenador = ? AND ec.estado = 'activo'
      ORDER BY ec.fecha_asignacion DESC
    `, [trainerId]);

    res.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes del entrenador:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.put('/trainers/:id_cliente/unassign', async (req, res) => {
  try {
    const clienteId = parseInt(req.params.id_cliente, 10);
    if (!clienteId) {
      return res.status(400).json({ error: 'ID de cliente inválido' });
    }

    const [result] = await db.query(`
      UPDATE entrenador_cliente
      SET estado = 'inactivo'
      WHERE id_cliente = ? AND estado = 'activo'
    `, [clienteId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró una asignación activa para este cliente' });
    }

    res.json({ message: 'Cliente desasignado del entrenador' });
  } catch (error) {
    console.error('Error al desasignar cliente:', error);
    res.status(500).json({ error: 'Error al desasignar cliente' });
  }
});

router.get('/unassigned-clients', async (req, res) => {
  try {
    const [clients] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.apellidos, u.email
      FROM usuarios u
      LEFT JOIN entrenador_cliente ec ON u.id_usuario = ec.id_cliente AND ec.estado = 'activo'
      WHERE u.id_rol = 2 AND ec.id_cliente IS NULL
      ORDER BY u.nombre ASC
    `);
    res.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes sin entrenador:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.post('/trainers/:id_entrenador/assign/:id_cliente', async (req, res) => {
  try {
    const idEntrenador = parseInt(req.params.id_entrenador, 10);
    const idCliente = parseInt(req.params.id_cliente, 10);

    if (!idEntrenador || !idCliente) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    // Inactivar asignaciones previas si las hubiera
    await db.query(`
      UPDATE entrenador_cliente
      SET estado = 'inactivo'
      WHERE id_cliente = ? AND estado = 'activo'
    `, [idCliente]);

    // Crear nueva asignación o reactivar una existente
    await db.query(`
      INSERT INTO entrenador_cliente (id_entrenador, id_cliente, fecha_asignacion, estado)
      VALUES (?, ?, NOW(), 'activo')
      ON DUPLICATE KEY UPDATE 
        estado = 'activo', 
        fecha_asignacion = NOW()
    `, [idEntrenador, idCliente]);

    res.json({ message: 'Cliente asignado correctamente' });
  } catch (error) {
    console.error('Error al asignar cliente:', error);
    res.status(500).json({ error: 'Error al asignar cliente' });
  }
});

router.post('/exercises', async (req, res) => {
  try {
    const id = await Exercise.create(req.body);
    res.status(201).json({ id, message: 'Ejercicio creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ejercicio' });
  }
});

router.put('/exercises/:id', async (req, res) => {
  try {
    await Exercise.update(req.params.id, req.body);
    res.json({ message: 'Ejercicio actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
});

router.delete('/exercises/:id', async (req, res) => {
  try {
    await Exercise.delete(req.params.id);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
});

module.exports = router;