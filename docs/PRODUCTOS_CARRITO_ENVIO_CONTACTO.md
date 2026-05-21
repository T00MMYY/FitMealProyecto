# Productos, Carrito, Envío y Contacto

---

## Productos

Los productos se guardan en MySQL (`tabla productos`) y se sirven via API:

- `GET /api/products` — lista todos (pública)
- `GET /api/products/:id` — detalle (pública)
- `POST / PUT / DELETE` — solo admin (requiere JWT)

Hay 3 categorías: **Proteínas (5)**, **Vitaminas (6)**, **Barritas (7)**.

**Precios por formato:** el precio cambia según el tamaño elegido (500g, 1kg, 2kg…). La tabla de precios está en `frontend/src/constants/products.js` y en `models/Order.js`. El backend siempre recalcula el precio — el cliente no puede manipularlo.

**Usuarios sin cuenta** pueden ver el catálogo libremente. Al pulsar "Añadir al carrito" se les pide que inicien sesión o se registren.

---

## Carrito

Se guarda en `localStorage` del navegador:

- Sin login → clave `fitmeal_cart_guest`
- Con login → clave `fitmeal_cart_<id_usuario>`

**Al hacer login**, el carrito de guest se fusiona automáticamente con el del usuario (si hay el mismo producto+formato, suma las cantidades).

Cada item tiene esta estructura:
```json
{ "id": 13, "nombre": "Protein Whey Coffee", "precio": 39.99, "formato": "1kg", "cantidad": 2 }
```

---

## Pedidos y Envío

**Flujo al hacer clic en "Confirmar pedido":**

1. El frontend manda `POST /api/orders` con los items, dirección y email
2. El backend verifica que cada producto existe, está disponible y tiene stock
3. Se crea el pedido en BD dentro de una transacción SQL (si algo falla, se cancela todo)
4. Se descuenta el stock de cada producto
5. Se envía un email de confirmación al comprador

**Envío:**
- Pedido ≥ 49 € → **gratis**
- Pedido < 49 € → **4,99 €**

**Email de confirmación** — se genera con Nodemailer y una cuenta Gmail. Incluye número de pedido, productos comprados, gastos de envío y total. Si el email falla, el pedido se crea igualmente.

**Configuración necesaria en `.env`:**
```
GMAIL_USER=tucuenta@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   ← contraseña de aplicación de Google, no la normal
```

---

## Contacto

El formulario envía `nombre`, `email`, `teléfono` (opcional) y `mensaje` a `POST /api/contact`.

El backend hace **dos envíos**:
1. **Al equipo FitMeal** — notificación con los datos del usuario
2. **Al usuario** — confirmación de que se ha recibido su mensaje

Requiere las mismas credenciales de Gmail del `.env`. Sin ellas el formulario da error.
