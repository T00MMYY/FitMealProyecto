const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { generateToken, COOKIE_CONFIG } = require('../middleware/auth');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function oauthNotConfigured(provider) {
  return (req, res) => {
    res.status(503).json({
      error: `OAuth de ${provider} no configurado en el servidor`
    });
  };
}

// ============================================
// OAUTH GITHUB
// ============================================

// Ruta para iniciar autenticación con GitHub
if (passport.oauthProviders?.github) {
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );
} else {
  router.get('/github', oauthNotConfigured('GitHub'));
}

// Callback de GitHub
if (passport.oauthProviders?.github) {
  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login-error', session: false }),
    (req, res) => {
      const token = generateToken({
        id_usuario: req.user.id_usuario,
        email: req.user.email,
        id_rol: req.user.id_rol
      });

      res.cookie('fitmeal_token', token, COOKIE_CONFIG);
      res.redirect(`${FRONTEND_URL}/auth/success?provider=github`);
    }
  );
} else {
  router.get('/github/callback', oauthNotConfigured('GitHub'));
}

// ============================================
// OAUTH GOOGLE
// ============================================

// Ruta para iniciar autenticación con Google
if (passport.oauthProviders?.google) {
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
} else {
  router.get('/google', oauthNotConfigured('Google'));
}

// Callback de Google
if (passport.oauthProviders?.google) {
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login-error', session: false }),
    (req, res) => {
      const token = generateToken({
        id_usuario: req.user.id_usuario,
        email: req.user.email,
        id_rol: req.user.id_rol
      });

      res.cookie('fitmeal_token', token, COOKIE_CONFIG);
      res.redirect(`${FRONTEND_URL}/auth/success?provider=google`);
    }
  );
} else {
  router.get('/google/callback', oauthNotConfigured('Google'));
}

// ============================================
// RUTA DE ERROR DE LOGIN OAUTH
// ============================================
router.get('/login-error', (req, res) => {
  res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
});


module.exports = router;
