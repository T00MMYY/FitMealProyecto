// Cargar variables de entorno
require('dotenv').config();

const REQUIRED_ENV = ['JWT_SECRET', 'SESSION_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k]);
if (missingEnv.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingEnv.join(', '));
  process.exit(1);
}

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();
const port = process.env.PORT || 3000;

// Cargar documentación Swagger
const swaggerDocument = YAML.load('./monlau-FitMealAPI-1.0.0-resolved.yaml');

// ============================================
// MIDDLEWARES
// ============================================

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Configuración de sesiones (necesario para Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// SWAGGER DOCUMENTATION
// ============================================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================================
// RUTAS
// ============================================

// Rutas de autenticación (JWT)
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Rutas de OAuth (GitHub y Google)
const oauthRouter = require('./routes/oauth');
app.use('/auth', oauthRouter);

// Rutas CRUD protegidas
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products'); 
const plansRouter = require('./routes/plans');
const exercisesRouter = require('./routes/exercises');
const recipesRouter = require('./routes/recipes');

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/plans', plansRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/recipes', recipesRouter);

// Rutas de administración
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// ============================================
// FRONTEND ESTÁTICO
// ============================================

app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA catch-all: cualquier ruta no reconocida sirve el index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const response = { error: 'Error interno del servidor' };
  if (process.env.NODE_ENV !== 'production') {
    response.details = err.message;
  }
  res.status(err.status || 500).json(response);
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📖 Documentación en http://localhost:${port}/api-docs`);
});

