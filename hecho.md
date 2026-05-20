# Revisión FitMeal — Checklist

---

## API

- [x] Swagger accesible en `http://localhost:3000/api-docs`
- [x] Rutas de autenticación correctas: solo Google OAuth + registro/login normal (GitHub eliminado)
- [x] Registro y login funcional contra BD — tokens JWT generan `{id_usuario, id_rol, plan}` correctamente
- [x] `requireRole` corregido para tolerar tokens legacy (`id_rol ?? rol`)

---

## Docker / Despliegue

- [x] Contenedor `fitmeal-api` reconstruido — estaba 5 semanas desactualizado (tokens usaban `{id, rol}` en vez de `{id_usuario, id_rol}`)
- [x] Volumen Docker `./uploads:/app/uploads` añadido en `docker-compose.yml` — las fotos de perfil ahora persisten entre reconstrucciones del contenedor

---

## Base de datos

### Columnas y tablas nuevas
- [x] Columna `plan VARCHAR(20) DEFAULT 'basic'` añadida a `usuarios` — valores válidos: `basic`, `avanzado`, `experto`
- [x] Tabla `plan_comida` creada — almacena las recetas que la IA asigna a cada usuario por día y momento (desayuno, almuerzo, comida, merienda, cena)

### Correcciones
- [x] Bug `foto_url` → `foto_perfil` corregido en `models/User.js` — las actualizaciones de foto de perfil fallaban silenciosamente
- [x] Rol `entrenador` (id=4) añadido a tabla `roles` — faltaba en BD aunque las rutas `/api/trainers` ya lo requerían
- [x] Columna `plan` de `usuarios` en `allowedFields` de `User.update` corregida

### Planes de suscripción
| id | Plan | Precio | Acceso |
|----|------|--------|--------|
| 1 | Plan Básico | 0€ | Catálogo workouts, favoritos, dashboard, ver rutinas |
| 2 | Plan Avanzado | 9.99€/mes | Todo lo anterior + rutinas y recetas generadas por IA (Gemini API) |
| 5 | Plan Experto | 19.99€/mes | Todo lo anterior + entrenador personal real asignado |

### Roles
| id | Rol | Uso |
|----|-----|-----|
| 1 | admin | Acceso total, gestión de la plataforma |
| 2 | usuario | Usuario normal (cualquier plan) |
| 3 | premium | Sin uso activo — el plan se gestiona por columna `plan` |
| 4 | entrenador | Acceso a gestión de clientes (`/api/trainers`) |

### Backup
- [x] `compartido/fitness_platform_backup.sql` regenerado con el estado actual — encoding limpio (utf8mb4), 19 tablas, sin caracteres corruptos. Tus compañeros deben importar este archivo para tener la BD sincronizada.

---

### Mejoras adicionales backend
- [x] `requirePremium` refactorizado a `requirePlan('avanzado','experto')` — el check anterior comparaba contra `'premium'` que ya no existe
- [x] Error handler en producción ya no expone `stack trace`
- [x] `version: '3.8'` eliminado de `docker-compose.yml` (atributo obsoleto)

### IA — Gemini
- [x] SDK `@google/generative-ai` instalado
- [x] `config/gemini.js` — inicializa el modelo `gemini-2.5-flash`, arranca sin clave (warning) sin romper el servidor
- [x] `controllers/aiController.js` — genera rutina + plan de comida 7 días llamando a Gemini con el perfil del usuario y los ejercicios/recetas existentes en BD
- [x] `routes/ai.js` — rutas protegidas por `requirePlan('avanzado','experto')`
  - `POST /api/ai/generate-plan` — genera y guarda el plan en BD
  - `GET  /api/ai/plan-comida` — devuelve el plan de comida activo del usuario
- [x] `GEMINI_API_KEY` añadida a `.env.example`
- [x] `GEMINI_API_KEY` configurada en `.env` — modelo `gemini-2.5-flash` funcionando
- [x] IA probada end-to-end: genera rutina de 12 ejercicios + plan de comida 7 días guardados en BD
- [x] Plan en JWT corregido — login y registro ahora incluyen `plan` en el token
- [x] `requirePremium` → `requirePlan('avanzado')` en rutas IA (Experto usa entrenador real, no IA)

## Frontend
lo primero mejoraremos la home, lo que quiero es un rediseño, quiero poner un scrolltrigger, te pondre una carpeta donde habran varias imagenes las cuales pondras en cada frame 
_(pendiente)_
