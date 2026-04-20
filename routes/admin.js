const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Exercise = require('../models/Exercise');
const { verifyToken } = require('../middleware/auth');

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.id_rol !== 1) {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(verifyToken);
// router.use(requireAdmin);

// DASHBOARD - Estadísticas
router.get('/stats', async (req, res) => {
  try {
    const [userStats] = await req.db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN objetivo = 'perder_grasa' THEN 1 ELSE 0 END) as perder_grasa,
        SUM(CASE WHEN objetivo = 'ganar_musculo' THEN 1 ELSE 0 END) as ganar_musculo,
        SUM(CASE WHEN objetivo = 'mantenerse' THEN 1 ELSE 0 END) as mantener
      FROM usuarios
    `);

    const totalRecipes = await Recipe.count();
    const totalExercises = await Exercise.count();

    res.json({
      totalUsers: userStats[0].total_users,
      totalRecipes,
      totalExercises,
      objetivos: {
        perderGrasa: userStats[0].perder_grasa,
        ganarMusculo: userStats[0].ganar_musculo,
        mantener: userStats[0].mantener
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// USUARIOS
router.get('/users', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const users = await User.findAll(offset, limit);
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_rol } = req.body;
    
    await req.db.query('UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?', [id_rol, id]);
    res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_cuenta } = req.body;
    
    await req.db.query('UPDATE usuarios SET estado_cuenta = ? WHERE id_usuario = ?', [estado_cuenta, id]);
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RECETAS
router.get('/recipes', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const recipes = await Recipe.findAll(offset, limit);
    res.json(recipes);
  } catch (error) {
    console.error('Error obteniendo recetas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/recipes', async (req, res) => {
  try {
    const recipeData = { ...req.body, id_usuario: req.user.id_usuario };
    const id = await Recipe.create(recipeData);
    res.status(201).json({ id, message: 'Receta creada correctamente' });
  } catch (error) {
    console.error('Error creando receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.update(id, req.body);
    res.json({ message: 'Receta actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.delete(id);
    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// EJERCICIOS
router.get('/exercises', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const exercises = await Exercise.findAll(offset, limit);
    res.json(exercises);
  } catch (error) {
    console.error('Error obteniendo ejercicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/exercises', async (req, res) => {
  try {
    const id = await Exercise.create(req.body);
    res.status(201).json({ id, message: 'Ejercicio creado correctamente' });
  } catch (error) {
    console.error('Error creando ejercicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Exercise.update(id, req.body);
    res.json({ message: 'Ejercicio actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando ejercicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Exercise.delete(id);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando ejercicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;