const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { verifyToken, COOKIE_CONFIG } = require('../middleware/auth');
const AuthController = require('../controllers/authController');
const User = require('../models/User');

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Demasiados intentos. Por favor espera 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);

router.post('/logout', (req, res) => {
  const clearCookieOptions = {
    httpOnly: COOKIE_CONFIG.httpOnly,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    path: '/'
  };

  res.clearCookie('fitmeal_token', clearCookieOptions);

  if (req.session) {
    req.session.destroy(() => {
      res.json({ message: 'Sesión cerrada correctamente' });
    });
    return;
  }

  res.json({ message: 'Sesión cerrada correctamente' });
});

router.get('/verify', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id_usuario || req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    delete user.password_hash;
    
    res.json({
      message: 'Token válido',
      user: user
    });
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    res.status(500).json({ error: 'Error del servidor al verificar sesión' });
  }
});

module.exports = router;
