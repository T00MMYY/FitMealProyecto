# Precio Dinámico + Email Contacto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir precio dinámico por talla en ProductDetail y envío de dos emails al submitear el formulario de contacto.

**Architecture:** Feature 1 es solo frontend — ampliar `OPCIONES_CATEGORIA` con precios por talla y recalcular el precio mostrado al cambiar selección. Feature 2 añade un endpoint `POST /api/contact` en el backend (Nodemailer + Gmail SMTP) que envía notificación a FitMeal y confirmación al usuario, y actualiza Contact.jsx para hacer POST real en lugar de `setSent(true)` directo.

**Tech Stack:** React 19 + Vite (frontend), Node.js + Express (backend), Nodemailer 6.x, Gmail SMTP con App Password

---

## File Map

| Archivo | Acción |
|---------|--------|
| `frontend/src/pages/ProductDetail.jsx` | Modificar |
| `controllers/contactController.js` | Crear |
| `routes/contact.js` | Crear |
| `index.js` | Modificar (registrar ruta) |
| `package.json` | Modificar (añadir nodemailer) |
| `.env` | Modificar (credenciales Gmail) |
| `frontend/src/pages/Contact.jsx` | Modificar |

---

## Task 1: Precio dinámico por talla en ProductDetail

**Files:**
- Modify: `frontend/src/pages/ProductDetail.jsx`

- [ ] **Step 1: Añadir precios por talla a OPCIONES_CATEGORIA**

Reemplazar el objeto `OPCIONES_CATEGORIA` completo (líneas 30–49) con:

```jsx
const OPCIONES_CATEGORIA = {
  5: {
    tieneSabor: true,
    sabores: ['Chocolate', 'Vainilla', 'Fresa', 'Cookies & Cream', 'Natural', 'Caramelo'],
    tallas: ['500g', '1kg', '2kg', '5kg'],
    precios: { '500g': 24.99, '1kg': null, '2kg': 41.99, '5kg': 89.99 },
    labelTallas: 'Cantidad',
  },
  6: {
    tieneSabor: false,
    sabores: [],
    tallas: ['30 caps', '60 caps', '90 caps', '180 caps'],
    precios: { '30 caps': 9.99, '60 caps': 17.99, '90 caps': 24.99, '180 caps': 44.99 },
    labelTallas: 'Unidades',
  },
  7: {
    tieneSabor: true,
    sabores: ['Chocolate', 'Vainilla', 'Caramelo', 'Stracciatella', 'Coco'],
    tallas: ['1 ud', 'Caja 6', 'Caja 12', 'Caja 24'],
    precios: { '1 ud': 2.49, 'Caja 6': 13.99, 'Caja 12': 25.99, 'Caja 24': 47.99 },
    labelTallas: 'Formato',
  },
};
```

`null` en el campo `precios` significa "usar el precio de la BD" (es el precio base de 1kg para proteínas).

- [ ] **Step 2: Añadir estado precioActual**

Después del estado `cantidad` (línea ~61), añadir:

```jsx
const [precioActual, setPrecioActual] = useState(null);
```

- [ ] **Step 3: Inicializar precioActual en el useEffect**

Reemplazar el `useEffect` completo (líneas 63–72) con:

```jsx
useEffect(() => {
  api.get(`/api/products/${id}`)
    .then((res) => {
      const p = res.data.product;
      setProducto(p);
      const opciones = OPCIONES_CATEGORIA[p.id_categoria] || OPCIONES_CATEGORIA[5];
      const tallaPorDefecto = opciones.tallas[1] || opciones.tallas[0];
      setTalla(tallaPorDefecto);
      const precioPorDefecto = opciones.precios[tallaPorDefecto] ?? parseFloat(p.precio);
      setPrecioActual(precioPorDefecto);
    })
    .finally(() => setCargando(false));
}, [id]);
```

- [ ] **Step 4: Actualizar precioActual al hacer click en una talla**

Buscar los botones de talla (dentro del `.map((t) => (...))` en `opciones.tallas`). Cambiar el `onClick` de:

```jsx
onClick={() => setTalla(t)}
```

a:

```jsx
onClick={() => {
  setTalla(t);
  const nuevoPrecio = opciones.precios[t] ?? parseFloat(producto.precio);
  setPrecioActual(nuevoPrecio);
}}
```

- [ ] **Step 5: Eliminar la variable precio fija y usar precioActual**

Eliminar la línea (alrededor de línea 98):

```jsx
const precio = parseFloat(producto.precio).toFixed(2);
```

Buscar donde se muestra el precio total (alrededor de línea 276):

```jsx
{(precio * cantidad).toFixed(2)}
```

Reemplazar con:

```jsx
{((precioActual ?? parseFloat(producto.precio)) * cantidad).toFixed(2)}
```

- [ ] **Step 6: Pasar precioActual al carrito en addToCart**

Buscar el `onClick` del botón "Añadir al carrito". Cambiar `precio: Number(producto.precio)` por `precio: precioActual ?? Number(producto.precio)`:

```jsx
onClick={() =>
  addToCart({
    id: producto.id_producto,
    nombre: producto.nombre_producto,
    precio: precioActual ?? Number(producto.precio),
    talla,
    cantidad,
    imagen,
  })
}
```

- [ ] **Step 7: Verificar en el navegador**

```bash
cd frontend && npm run dev
```

- Abrir un producto de proteína (categoría 5)
- Seleccionar **500g** → debe mostrar **24.99 EUR**
- Seleccionar **1kg** → debe mostrar el precio de la BD
- Seleccionar **2kg** → debe mostrar **41.99 EUR**
- Seleccionar **5kg** → debe mostrar **89.99 EUR**
- Añadir al carrito y verificar que el precio en carrito coincide con la talla seleccionada

- [ ] **Step 8: Commit**

```bash
git add frontend/src/pages/ProductDetail.jsx
git commit -m "feat: precio dinamico por talla en ProductDetail"
```

---

## Task 2: Instalar Nodemailer y configurar credenciales Gmail

**Files:**
- Modify: `package.json` (raíz backend)
- Modify: `.env`

- [ ] **Step 1: Instalar nodemailer**

Desde `FitMealProyecto/` (raíz del backend):

```bash
npm install nodemailer
```

Verificar que aparece en `package.json` bajo `dependencies`:
```json
"nodemailer": "^6.x.x"
```

- [ ] **Step 2: Obtener App Password de Gmail**

1. Ir a [myaccount.google.com](https://myaccount.google.com) con `fitmealtks@gmail.com`
2. **Seguridad** → **Verificación en 2 pasos** → activar si no está activa
3. **Seguridad** → **Contraseñas de aplicaciones**
4. App: "Correo" / Dispositivo: "Otro" → escribir "FitMeal" → **Generar**
5. Copiar la contraseña de **16 caracteres** generada (formato: `xxxx xxxx xxxx xxxx`)

- [ ] **Step 3: Añadir credenciales al .env**

Abrir `.env` (raíz backend) y añadir al final:

```
GMAIL_USER=fitmealtks@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Reemplazar `xxxx xxxx xxxx xxxx` con la contraseña del paso anterior.

- [ ] **Step 4: Commit (sin .env)**

```bash
git add package.json package-lock.json
git commit -m "feat: instalar nodemailer para email de contacto"
```

`.env` ya está en `.gitignore` — no añadirlo nunca al commit.

---

## Task 3: Crear controlador de contacto

**Files:**
- Create: `controllers/contactController.js`

- [ ] **Step 1: Crear el archivo**

Crear `controllers/contactController.js`:

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendContactEmail(req, res) {
  const { nombre, email, telefono, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await transporter.sendMail({
      from: `"FitMeal" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\n\nMensaje:\n${mensaje}`,
    });

    await transporter.sendMail({
      from: `"FitMeal" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Hemos recibido tu mensaje — FitMeal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #D30F15; font-style: italic; text-transform: uppercase; margin: 0 0 8px;">FITMEAL</h1>
          <h2 style="color: #ffffff; margin: 0 0 16px;">¡Mensaje recibido, ${nombre}!</h2>
          <p style="color: rgba(255,255,255,0.6); margin: 0 0 20px;">Hemos recibido tu mensaje y te responderemos en menos de 24 horas.</p>
          <div style="background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Tu mensaje</p>
            <p style="color: #ffffff; margin: 0;">${mensaje}</p>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">El equipo de FitMeal</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje. Inténtalo de nuevo.' });
  }
}

module.exports = { sendContactEmail };
```

- [ ] **Step 2: Commit**

```bash
git add controllers/contactController.js
git commit -m "feat: controlador de contacto con nodemailer"
```

---

## Task 4: Crear ruta de contacto y registrarla en Express

**Files:**
- Create: `routes/contact.js`
- Modify: `index.js`

- [ ] **Step 1: Crear routes/contact.js**

Crear `routes/contact.js`:

```js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

router.post('/', sendContactEmail);

module.exports = router;
```

- [ ] **Step 2: Registrar la ruta en index.js**

Abrir `index.js`. Buscar el bloque de `require` de rutas (donde están `authRoutes`, `productRoutes`, etc.) y añadir:

```js
const contactRoutes = require('./routes/contact');
```

Buscar el bloque de `app.use` de rutas y añadir:

```js
app.use('/api/contact', contactRoutes);
```

- [ ] **Step 3: Verificar que el servidor arranca sin errores**

```bash
node index.js
```

Debe mostrar el mensaje de inicio del servidor sin errores. `Ctrl+C` para detener.

- [ ] **Step 4: Probar el endpoint con curl**

Con el servidor arrancado en otra terminal:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Test\",\"email\":\"fitmealtks@gmail.com\",\"telefono\":\"\",\"mensaje\":\"Prueba de contacto\"}"
```

Esperado: `{"success":true}` y dos emails en `fitmealtks@gmail.com`.

- [ ] **Step 5: Commit**

```bash
git add routes/contact.js index.js
git commit -m "feat: ruta POST /api/contact registrada en express"
```

---

## Task 5: Actualizar Contact.jsx para enviar al backend

**Files:**
- Modify: `frontend/src/pages/Contact.jsx`

- [ ] **Step 1: Añadir imports necesarios**

Al inicio de `frontend/src/pages/Contact.jsx`, añadir los imports que faltan (después de los existentes):

```jsx
import api from '../api/axios';
import toast from 'react-hot-toast';
```

- [ ] **Step 2: Añadir estado enviando**

Después de `const [sent, setSent] = useState(false);`, añadir:

```jsx
const [enviando, setEnviando] = useState(false);
```

- [ ] **Step 3: Reemplazar handleSubmit**

Reemplazar la función `handleSubmit` completa (actualmente solo hace `setSent(true)`) con:

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  setEnviando(true);
  try {
    await api.post('/api/contact', form);
    setSent(true);
  } catch {
    toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
  } finally {
    setEnviando(false);
  }
}
```

- [ ] **Step 4: Actualizar el botón de submit para mostrar estado de carga**

Buscar el `<motion.button type="submit" ...>` y reemplazarlo con:

```jsx
<motion.button
  type="submit"
  disabled={enviando}
  whileHover={enviando ? {} : { scale: 1.02, boxShadow: '0 0 30px rgba(211,15,21,0.4)' }}
  whileTap={enviando ? {} : { scale: 0.97 }}
  className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
  style={{ background: '#D30F15', color: '#fff' }}
>
  {enviando ? 'Enviando...' : 'Enviar mensaje'}
  {!enviando && (
    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
  )}
</motion.button>
```

- [ ] **Step 5: Verificar flujo completo en el navegador**

Con backend (`node index.js`) y frontend (`npm run dev`) arrancados:

1. Ir a `/contact`
2. Rellenar formulario con nombre, email real, y mensaje
3. Hacer click en **Enviar mensaje**
4. Verificar que el botón muestra **"Enviando..."** y queda deshabilitado
5. Verificar que aparece la pantalla de éxito (checkmark rojo)
6. Verificar que llegan los dos emails en `fitmealtks@gmail.com` (notificación) y en el email que pusiste en el formulario (confirmación)
7. Probar enviar con campos vacíos para verificar la validación HTML nativa

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Contact.jsx
git commit -m "feat: formulario de contacto envia emails via backend"
```
