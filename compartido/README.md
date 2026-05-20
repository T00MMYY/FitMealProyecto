# FitMeal — Setup para compañeros

Guía completa para tener el proyecto funcionando desde cero.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- [Node.js 18+](https://nodejs.org/) instalado
- [Git](https://git-scm.com/) instalado
- Git Bash (incluido con Git para Windows) — necesario para el script `.sh`

---

<<<<<<< HEAD
## 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPO]
cd FitMealProyecto
=======
## 1. Actualizar el repositorio

```bash
git pull origin main
>>>>>>> b59b0b2 (readme compartido)
```

---

## 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y rellena los valores obligatorios:

| Variable | Dónde conseguirla |
|---|---|
| `DB_USER` | Usar `fitmeal_user` |
| `DB_PASSWORD` | Usar `FitMeal123` |
| `JWT_SECRET` | Cualquier string largo aleatorio |
| `SESSION_SECRET` | Cualquier string largo aleatorio |
| `GOOGLE_CLIENT_ID` | Pedírselo a Kevin o crear en [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Igual que el anterior |
| `GEMINI_API_KEY` | Pedírselo a Kevin o crear en [aistudio.google.com](https://aistudio.google.com/app/apikey) (gratis) |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Opcional — solo necesario para emails (recuperar contraseña) |

---

## 3. Instalar dependencias y construir el frontend

```bash
# Dependencias del backend
npm install

# Dependencias y build del frontend
cd frontend
npm install
npm run build
cd ..
```

---

## 4. Descargar el dataset de ejercicios

Las imágenes no están en git (son ~102 MB). Descárgalas con:

```bash
bash scripts/fetch-exercises-dataset.sh
```

Esto crea `compartido/exercises/` con ~1746 imágenes JPG y `compartido/exercises.json`.
**Solo necesitas hacerlo una vez** (o cuando quieras actualizar el dataset).

---

## 5. Levantar los contenedores Docker

```bash
docker compose up -d --build
```

Levanta 4 servicios:
| Servicio | URL |
|---|---|
| API (Node.js) | http://localhost:3000 |
| Frontend (nginx) | http://localhost |
| phpMyAdmin | http://localhost:8081 |
| MySQL | puerto 3307 |

Espera ~15 segundos a que MySQL esté listo (`healthy`) antes de continuar:

```bash
docker compose ps   # fitmeal-db debe mostrar "(healthy)"
```

---

## 6. Importar la base de datos

```bash
docker exec -i FitMeal mysql -u root -pFitMealRoot123 fitness_platform < compartido/fitness_platform_backup.sql
```

Esto crea todas las tablas, roles, planes y datos de referencia.

---

## 7. Poblar los ejercicios

```bash
node migrate_ejercicios.js
```

Importa los ~873 ejercicios del dataset a la tabla `ejercicios`.
Al final debe mostrar: `SELECT COUNT(*) FROM ejercicios → 873`

---

## 8. Verificar que todo funciona

| Comprobación | Resultado esperado |
|---|---|
| http://localhost | Frontend carga |
| http://localhost:3000/api-docs | Swagger UI con todos los endpoints |
| http://localhost:8081 | phpMyAdmin (usuario: `root`, contraseña: `FitMealRoot123`) |
| http://localhost/exercises/Air_Bike/0.jpg | Imagen de ejercicio carga |
| `SELECT COUNT(*) FROM ejercicios;` en phpMyAdmin | 873 |

---

## Desarrollo local (frontend en modo dev)

Para trabajar con hot-reload en el frontend:

```bash
cd frontend
npm run dev
```

El frontend de desarrollo corre en http://localhost:5173 y tiene proxy configurado hacia la API y las imágenes de ejercicios.

> Los contenedores Docker deben seguir corriendo para que la API y la BD funcionen.

---

## Actualizar la base de datos

Cuando Kevin haga cambios en la BD y suba un nuevo backup:

```bash
git pull
docker exec -i FitMeal mysql -u root -pFitMealRoot123 fitness_platform < compartido/fitness_platform_backup.sql
```

---

## Generar un nuevo backup (solo Kevin)

```bash
docker exec FitMeal mysqldump -u root -pFitMealRoot123 fitness_platform > compartido/fitness_platform_backup.sql
git add compartido/fitness_platform_backup.sql
git commit -m "chore: actualizar backup BD"
git push
```

---

## Solución a problemas comunes

**`docker compose up` falla con "port already in use"**
Otro proceso usa el puerto 80, 3000 o 3307. Para en Docker Desktop cualquier contenedor que use esos puertos.

**La BD no conecta después de `up -d`**
MySQL tarda en arrancar. Espera a que `docker compose ps` muestre `(healthy)` en `fitmeal-db`.

**Las imágenes de ejercicios no cargan en http://localhost**
Ejecuta el paso 4 (`fetch-exercises-dataset.sh`) — la carpeta `compartido/exercises/` no está en git.

**Error `Cannot find module` al ejecutar `node migrate_ejercicios.js`**
Falta el paso 3 (`npm install` en la raíz).
