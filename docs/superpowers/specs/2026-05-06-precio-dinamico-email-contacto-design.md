# Design: Precio dinámico por talla + Email formulario contacto

**Fecha:** 2026-05-06  
**Proyecto:** FitMeal — proyecto académico 2DAW Monlau

---

## Feature 1: Precio dinámico por talla en ProductDetail

### Objetivo
El precio mostrado en la página de detalle de producto cambia en tiempo real al seleccionar una talla/cantidad diferente, igual que en MyProtein.

### Arquitectura
Solo frontend — sin cambios en BD ni backend.

### Implementación
En `frontend/src/pages/ProductDetail.jsx`, ampliar el objeto `OPCIONES_CATEGORIA` añadiendo un campo `precios` con el precio para cada talla:

```js
const OPCIONES_CATEGORIA = {
  5: { // Proteína
    tallas: ['500g', '1kg', '2kg', '5kg'],
    precios: { '500g': 24.99, '1kg': null, '2kg': 41.99, '5kg': 89.99 },
    // null = usar precio de la BD como precio base (1kg)
  },
  6: { // Vitaminas
    tallas: ['30 caps', '60 caps', '90 caps', '180 caps'],
    precios: { '30 caps': 9.99, '60 caps': 17.99, '90 caps': 24.99, '180 caps': 44.99 },
  },
  7: { // Barritas
    tallas: ['1 ud', 'Caja 6', 'Caja 12', 'Caja 24'],
    precios: { '1 ud': 2.49, 'Caja 6': 13.99, 'Caja 12': 25.99, 'Caja 24': 47.99 },
  },
};
```

El precio mostrado se calcula: `precioTalla ?? precioBase * cantidad`.

Al añadir al carrito, el precio que se guarda es el de la talla seleccionada.

### Cambios de archivo
- `frontend/src/pages/ProductDetail.jsx` — añadir `precios` a `OPCIONES_CATEGORIA`, añadir estado `precioActual`, calcular precio en función de `talla` seleccionada.

---

## Feature 2: Email al enviar formulario de contacto

### Objetivo
Al enviar el formulario de contacto, se envían dos emails automáticamente:
1. **A FitMeal** (`fitmealtks@gmail.com`): notificación con los datos del mensaje
2. **Al usuario**: confirmación de que su mensaje fue recibido

### Arquitectura

**Backend:**
- Instalar `nodemailer` como dependencia
- Credenciales Gmail en `.env`: `GMAIL_USER` y `GMAIL_APP_PASSWORD`
- Nueva ruta: `POST /api/contact`
- Nuevo controlador: `controllers/contactController.js`
- Nueva ruta registrada en `index.js`

**Frontend:**
- `Contact.jsx` hace POST a `/api/contact` con `{ nombre, email, telefono, mensaje }`
- Muestra estado de carga mientras espera respuesta
- En éxito: muestra pantalla de confirmación (ya existe)
- En error: muestra mensaje de error con toast

### Configuración Gmail
- Cuenta: `fitmealtks@gmail.com`
- Requiere **App Password** de Google (no la contraseña normal)
  - Activar 2FA en la cuenta Google
  - Ir a: Cuenta Google → Seguridad → Contraseñas de aplicaciones
  - Generar contraseña de 16 caracteres
  - Guardar en `.env` como `GMAIL_APP_PASSWORD`

### Email a FitMeal (notificación)
```
Asunto: Nuevo mensaje de contacto — [nombre]
Cuerpo:
  Nombre: [nombre]
  Email: [email]
  Teléfono: [telefono o "No proporcionado"]
  Mensaje: [mensaje]
```

### Email al usuario (confirmación)
```
Asunto: Hemos recibido tu mensaje — FitMeal
Cuerpo: Email HTML con estilo FitMeal confirmando recepción
```

### Cambios de archivos
- `package.json` — añadir `nodemailer`
- `.env` — añadir `GMAIL_USER` y `GMAIL_APP_PASSWORD`
- `controllers/contactController.js` — nuevo archivo
- `routes/contact.js` — nuevo archivo
- `index.js` — registrar ruta `/api/contact`
- `frontend/src/pages/Contact.jsx` — POST al backend, estados de carga/error

### Seguridad
- Credenciales nunca en el código, solo en `.env`
- `.env` ya está en `.gitignore`
- Rate limiting aplicado por el middleware global ya existente

---

## Resumen de archivos afectados

| Archivo | Tipo de cambio |
|---------|---------------|
| `frontend/src/pages/ProductDetail.jsx` | Modificar |
| `frontend/src/pages/Contact.jsx` | Modificar |
| `controllers/contactController.js` | Nuevo |
| `routes/contact.js` | Nuevo |
| `index.js` | Modificar (registrar ruta) |
| `package.json` (backend) | Modificar (añadir nodemailer) |
| `.env` | Modificar (añadir credenciales Gmail) |
