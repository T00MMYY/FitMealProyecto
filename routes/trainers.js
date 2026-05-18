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

// Obtener los clientes del entrenador actual
router.get('/clients', verifyToken, requireRole(4), trainerController.getMyClients);

// Asignar ejercicio a un cliente
router.post('/assign-exercise', verifyToken, requireRole(4), trainerController.assignExerciseToClient);

// Obtener rutina de un cliente
router.get('/clients/:id/routine', verifyToken, trainerController.getClientRoutine);

// Eliminar ejercicio asignado
router.delete('/routine/:id', verifyToken, requireRole(4), trainerController.deleteAssignedExercise);

// Rutas del historial de entrenamiento (Persistencia de progreso)
router.post('/log-workout', verifyToken, trainerController.logWorkout);
router.get('/today-progress', verifyToken, trainerController.getTodayProgress);

module.exports = router;
