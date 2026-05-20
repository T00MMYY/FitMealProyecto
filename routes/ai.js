const express = require('express');
const router = express.Router();
const { verifyToken, requirePlan } = require('../middleware/auth');
const AiController = require('../controllers/aiController');

// Genera rutina + plan de comida con IA (solo plan avanzado)
router.post('/generate-plan', verifyToken, requirePlan('avanzado'), AiController.generatePlan);

// Obtiene el plan de comida actual del usuario (solo plan avanzado)
router.get('/plan-comida', verifyToken, requirePlan('avanzado'), AiController.getPlanComida);

module.exports = router;
