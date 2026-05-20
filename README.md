# FitMeal API - Backend

API REST para la plataforma FitMeal con arquitectura MVC, Node.js, Express y MySQL.

## 🚀 Setup Rápido para Colaboradores

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd API
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales locales
```

### 4. Descargar dataset de ejercicios
```bash
bash scripts/fetch-exercises-dataset.sh
```
Descarga ~800 ejercicios con imágenes JPG de [free-exercise-db](https://github.com/yuhonas/free-exercise-db) a `compartido/exercises/`. No se sube a git por peso (~30 MB).

### 5. Levantar contenedores Docker
```bash
docker compose up -d --build
```

### 6. Poblar ejercicios en la BD
```bash
node migrate_ejercicios.js
```
Vacía y repuebla la tabla `ejercicios` con los ~800 del dataset. Las imágenes se sirven automáticamente desde `http://localhost/exercises/`.

### 7. Verificar que todo funciona
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs
- phpMyAdmin: http://localhost:8080

## 📦 Estructura del Proyecto

```
API/
├── config/          # Configuración (DB, Passport)
├── controllers/     # Controladores MVC
├── models/          # Modelos de datos
├── routes/          # Definición de rutas
├── middleware/      # Middlewares (auth, etc.)
├── docker-compose.yml
├── Dockerfile
└── index.js         # Punto de entrada
```

## 🔑 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión (devuelve JWT)
- `GET /auth/verify` - Verificar token

### Usuarios (requieren JWT)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Productos (requieren JWT)
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Planes (requieren JWT)
- `GET /api/plans` - Listar planes
- `POST /api/plans` - Crear plan
- `PUT /api/plans/:id` - Actualizar plan
- `DELETE /api/plans/:id` - Eliminar plan

### Contacto (público, sin JWT)
- `POST /api/contact` - Enviar mensaje del formulario de contacto

## 🛒 Cómo funcionan los productos (compra)

1. El usuario añade productos al **carrito** (se guarda en el navegador, sin BD).
2. En **Checkout** rellena los datos de la tarjeta (número, caducidad, CVV) y la dirección.
3. El pago es **simulado/demo**: no hay cobro real ni pasarela. Se valida la
   tarjeta en el frontend y se muestra un "Pedido confirmado" con un número
   tipo `FM-123456-789`.

> No hay backend de pedidos: el flujo de compra es solo demostración visual.

## 📧 Cómo funciona el contacto (email real)

El formulario `/contacto` **sí envía emails reales** con Nodemailer + Gmail:

- `POST /api/contact` con `{ nombre, email, telefono, mensaje }`.
- Se mandan 2 correos: uno al equipo (`GMAIL_USER`) y otro de confirmación al usuario.

Para que funcione, en el `.env`:

```bash
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=app_password_de_16_caracteres   # App Password de Gmail, NO la contraseña normal
```

> El App Password se genera en https://myaccount.google.com/apppasswords
> (requiere verificación en 2 pasos activada). Sin estas variables el envío falla.

## 🧪 Probar la API

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test",
    "apellidos": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Usar el token
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🐳 Comandos Docker

```bash
# Iniciar contenedores
docker compose up -d --build

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Reiniciar
docker-compose restart

# Ver contenedores activos
docker ps
```

## 🤝 Workflow de Colaboración

### 1. Antes de empezar a trabajar
```bash
git pull origin main
```

### 2. Crear rama para tu feature
```bash
git checkout -b feature/nombre-feature
```

### 3. Hacer commits
```bash
git add .
git commit -m "Descripción del cambio"
```

### 4. Push y Pull Request
```bash
git push origin feature/nombre-feature
# Crear Pull Request en GitHub
```

## 🛠️ Tecnologías

- **Node.js** + **Express.js**
- **MySQL** 8.0
- **Docker** + **Docker Compose**
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **Passport.js** para OAuth

## 📝 Variables de Entorno

Ver `.env.example` para la configuración completa.

## 🔐 Usuarios por Defecto

**Admin:**
- Email: `admin@fitmeal.com`
- Password: `alex123`

**Usuario normal:**
- Email: `usuario@fitmeal.com`
- Password: `usuario123`

## 📄 Licencia

Proyecto académico - 2DAW - Centre d'Estudis Monlau

//hola