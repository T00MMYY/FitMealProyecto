# FitMeal — Pendiente deploy (2026-04-22)

## Estado actual
Todo el código está pusheado a GitHub y la Pi tiene los cambios. El frontend está buildeado. El único bloqueante es el puerto 80 ocupado en la Pi, que impide que Nginx arranque.

---

## 🔴 Bloqueante — Puerto 80 ocupado en la Pi

Nginx no pudo arrancar porque algo ya usa el puerto 80.

**Paso 1 — Ver qué lo ocupa:**
```bash
ssh pi@100.111.64.92
sudo ss -tlnp | grep ':80 '
```

**Paso 2 — Pararlo (si es Apache u otro servicio):**
```bash
sudo systemctl stop apache2   # si es Apache
sudo systemctl disable apache2
# o el servicio que aparezca en el paso 1
```

**Paso 3 — Levantar Nginx:**
```bash
cd ~/projects/fitmeal
docker compose up -d fitmeal-nginx
docker compose ps
```

**Paso 4 — Reiniciar Cloudflare Tunnel:**
```bash
sudo systemctl restart cloudflared
```

**Paso 5 — Verificar:**
Abre `https://fitmeal.website` en el navegador. Debe cargar el frontend.

---

## 🟡 Después del bloqueante — Script de actualización

```bash
cp ~/projects/fitmeal/update-fitmeal.sh ~/update-fitmeal.sh
chmod +x ~/update-fitmeal.sh
```

---

## 🟡 GitHub Actions — Auto-deploy en cada push

Para que cada `git push` a `main` actualice la Pi automáticamente.

### 1. Generar clave SSH en la Pi
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions   # copiar esta clave privada
```

### 2. Crear Tailscale OAuth Client
- Ir a: https://login.tailscale.com/admin/settings/oauth
- Clic en **Generate OAuth client**
- Scope: `devices:write`
- Guardar el **Client ID** y el **Client Secret**
- En ACL de Tailscale (https://login.tailscale.com/admin/acls) añadir:
```json
"tagOwners": {
    "tag:ci": []
}
```

### 3. Añadir Secrets en GitHub
Repo → Settings → Secrets and variables → Actions → New repository secret

| Secret | Valor |
|---|---|
| `PI_HOST` | `100.111.64.92` |
| `PI_SSH_KEY` | contenido de `~/.ssh/github_actions` (clave privada) |
| `TS_OAUTH_CLIENT_ID` | Client ID de Tailscale |
| `TS_OAUTH_SECRET` | Client Secret de Tailscale |

---

## ✅ Ya hecho
- nginx.conf creado
- docker-compose.yml actualizado con Nginx como reverse proxy
- Node.js ya no sirve estáticos (solo API)
- Cloudflare Tunnel apunta a puerto 80
- Frontend buildeado en la Pi (`frontend/dist` existe)
- Fetch de `localhost:3000` corregido en: Recetas, RecetaDetalle, Ejercicios, workouts
- GitHub Actions workflow creado (`.github/workflows/deploy.yml`)
- Todo pusheado a `T00MMYY/FitMealProyecto`
