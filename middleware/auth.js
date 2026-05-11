const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  // Read from httpOnly cookie first, fallback to Authorization header
  const cookieToken = req.cookies?.fitmeal_token;
  const headerToken = req.headers['authorization']?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id_usuario: user.id_usuario || user.id,
      email: user.email,
      id_rol: user.id_rol || user.rol,
      plan: user.plan || 'basic'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token expira en 24 horas
  );
};

// Middleware para verificar rol del usuario
// Uso: requireRole(1) para admin, requireRole(1, 3) para admin o premium
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ error: 'Token no proporcionado' });
    }

    if (!roles.includes(req.user.id_rol)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};

// Middleware para verificar plan premium
const requirePremium = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const user = await User.findById(req.user.id_usuario);
    if (!user || user.plan !== 'premium') {
      return res.status(403).json({ error: 'Esta función requiere un plan premium' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar plan' });
  }
};

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 24 * 60 * 60 * 1000
};

module.exports = { verifyToken, generateToken, requireRole, requirePremium, COOKIE_CONFIG };
