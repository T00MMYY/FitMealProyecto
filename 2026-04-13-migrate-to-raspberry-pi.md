# Migración a Raspberry Pi 5 — Estado actual

**Goal:** API FitMeal (Node.js + MySQL) desplegada en Raspberry Pi 5 compartida. Los 3 miembros acceden a la misma BD y API; el frontend corre en local de cada uno.

---

## Estado — 2026-04-20 ✅ COMPLETADO

- Docker 29.4 + Docker Compose v5 instalados
- Repo `https://github.com/T00MMYY/FitMealProyecto.git` clonado en `~/projects/fitmeal`
- `.env` en la Pi con secrets reales y callbacks actualizados
- Contenedores corriendo:
  - `FitMeal` (MySQL 8.0) → puerto **3307** externo (3306 ocupado por MariaDB local)
  - `fitmeal-api` (Node.js) → puerto **3000**
  - `fitmeal-phpmyadmin` → puerto **8081**
- Schema importado (volumen Docker `fitmeal-data` preservado entre sesiones)
- Script de actualización: `~/update-fitmeal.sh`
- Dominio `fitmeal.website` → Cloudflare Tunnel activo
  - Túnel ID: `b417e6da-16c9-4ddc-844e-fb8c3c460e93`
  - Config: `/home/pi/.cloudflared/config.yml`
  - Servicio systemd habilitado (arranca con la Pi)
- `https://fitmeal.website` → responde 200 ✓
- OAuth GitHub → `https://fitmeal.website/auth/github/callback` ✓
- OAuth Google → `https://fitmeal.website/auth/google/callback` ✓
- `frontend/src/api/axios.js` — fallback → `https://fitmeal.website` (commit `9abb15f`, pusheado)
- ZeroTier configurado para compañeros ✅

---

## Arquitectura activa

```
Internet → fitmeal.website (Cloudflare Tunnel) → Pi:3000 (fitmeal-api)
                                                        ↓
                                               Pi:3307 (MySQL)
```

| Acceso | URL | Estado |
|---|---|---|
| API pública | `https://fitmeal.website` | ✅ activo |
| phpMyAdmin | `http://192.168.1.37:8081` | ✅ red local |
| MySQL Workbench | `192.168.1.37:3307` | ✅ red local |
| SSH Kevin | `ssh pi@100.111.64.92` | ✅ Tailscale |

---

## Pendiente: Deploy automático con GitHub Actions + Nginx

**Problema actual:** El frontend corre con `vite dev` en la Pi. Los cambios no se reflejan automáticamente al hacer push — hay que actualizar manualmente.

**Objetivo:** `git push origin main` → `fitmeal.website` se actualiza solo.

**Arquitectura planeada:**
- Nginx como nuevo contenedor en `docker-compose.yml` → sirve `frontend/dist` (build estático)
- `~/update-fitmeal.sh` ampliado para hacer `npm run build` del frontend
- GitHub Actions workflow: en cada push a `main` → SSH a la Pi → ejecuta el script

**Flujo resultante:**
```
git push origin main
    → GitHub Actions (SSH a Pi via clave dedicada como GitHub Secret)
        → git pull
        → npm run build (frontend → genera dist/)
        → docker compose restart nginx + fitmeal-api
    → fitmeal.website muestra los cambios
```

**Decisiones pendientes:**
- [ ] Cómo GitHub Actions accede a la Pi (clave SSH nueva como GitHub Secret, o túnel)
- [ ] Confirmar repo: `T00MMYY/FitMealProyecto`
- [ ] Decidir si Nginx va en nuevo contenedor o Node.js sirve el `dist` (más simple)

---

## Notas importantes

- `fitness_platform_backup.sql` tiene BOM/caracteres binarios — **NO usar** para importar schema
- MySQL expuesto en puerto **3307** (no 3306) — MariaDB ocupa 3306 en la Pi
- El `docker-compose.yml` del repo tiene `3306:3306` → la Pi lo tiene modificado localmente a `3307:3306` (**no commitear** este cambio)
- Contraseña SSH de la Pi: `123456` (cambiar cuando haya tiempo)
- Para actualizar la API tras un push: `ssh pi@100.111.64.92 "~/update-fitmeal.sh"`
- `cert.pem` de Cloudflare: `C:/Users/kevin/.cloudflared/cert.pem` (Windows) y `~/.cloudflared/cert.pem` (Pi)
