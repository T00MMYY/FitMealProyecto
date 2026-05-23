const express = require('express');
const router = express.Router();
const { verifyToken, requirePlan } = require('../middleware/auth');
const AiController = require('../controllers/aiController');

// Genera rutina + plan de comida con IA (solo plan premium)
router.post('/generate-plan', verifyToken, requirePlan('premium'), AiController.generatePlan);

// Obtiene el plan de comida actual del usuario (solo plan premium)
router.get('/plan-comida', verifyToken, requirePlan('premium'), AiController.getPlanComida);

module.exports = router;
