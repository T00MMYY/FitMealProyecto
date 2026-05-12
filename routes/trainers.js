const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Obtener el entrenador asignado al usuario logueado
router.get('/my-trainer', verifyToken, trainerController.getMyTrainer);

// Obtener lista de todos los entrenadores
router.get('/', verifyToken, trainerController.getAvailableTrainers);

// Asignar un entrenador a un cliente (Solo para Administradores)
router.post('/assign', verifyToken, requireRole(1), trainerController.assignTrainer);

module.exports = router;
