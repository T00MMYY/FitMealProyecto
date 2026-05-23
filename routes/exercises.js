const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM ejercicios ORDER BY titulo ASC';
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/detail/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM ejercicios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/muscles', async (req, res, next) => {
  try {
    const query = 'SELECT id, nombre_key FROM musculos ORDER BY nombre_key ASC';
    const [rows] = await db.execute(query);

    if (rows.length === 0) {
      const fallbackQuery = `
        SELECT DISTINCT e.musculo_id AS id,
               COALESCE(m.nombre_key, CONCAT('MUSCULO_', e.musculo_id)) AS nombre_key
        FROM ejercicios e
        LEFT JOIN musculos m ON e.musculo_id = m.id
        ORDER BY nombre_key ASC
      `;
      const [fallbackRows] = await db.execute(fallbackQuery);
      return res.json(fallbackRows);
    }

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/muscles/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM ejercicios WHERE musculo_id = ? ORDER BY titulo ASC';
    const [rows] = await db.execute(query, [id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:muscleName', async (req, res, next) => {
  try {
    const { muscleName } = req.params;
    
    const query = `
      SELECT e.* FROM ejercicios e
      JOIN musculos m ON e.musculo_id = m.id
      WHERE m.nombre_key = ?
    `;

    const [rows] = await db.execute(query, [muscleName.toUpperCase()]);
    res.json(rows);
  } catch (error) {
    next(error); 
  }
});

module.exports = router; 