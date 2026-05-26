const express = require('express');
const router = express.Router();
const { verifyToken, requirePlan } = require('../middleware/auth');
const AiController = require('../controllers/aiController');

// Genera rutina + plan de comida con IA (plan avanzado o experto)
router.post('/generate-plan', verifyToken, requirePlan('avanzado', 'experto'), AiController.generatePlan);

// Obtiene el plan de comida actual del usuario (plan avanzado o experto)
router.get('/plan-comida', verifyToken, requirePlan('avanzado', 'experto'), AiController.getPlanComida);

module.exports = router;
