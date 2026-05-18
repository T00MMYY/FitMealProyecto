const express = require('express');
const router = express.Router();
const routinesController = require('../controllers/routinesController');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get('/', routinesController.getUserRoutines);
router.post('/', routinesController.createRoutine);
router.get('/:id', routinesController.getRoutineById);
router.post('/:id/exercises', routinesController.addExerciseToRoutine);
router.delete('/exercise/:id', routinesController.deleteExercise);
router.delete('/:id', routinesController.deleteRoutine);

module.exports = router;
