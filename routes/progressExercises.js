const express = require('express');
const router = express.Router();
const ProgressExercisesController = require('../controllers/progressExercisesController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/:id_ejercicio', ProgressExercisesController.getProgress);
router.post('/', ProgressExercisesController.addProgress);
router.delete('/:id_progreso', ProgressExercisesController.removeProgress);

module.exports = router;
