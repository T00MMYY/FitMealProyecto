import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-red-500';

const emptyForm = {
  name: '',
  email: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  address: '',
  city: '',
  postalCode: '',
};

function currency(value) {
  return Number(value).toFixed(2);
}

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

function formatCardNumber(value) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function getCardBrand(cardNumber) {
  const digits = onlyDigits(cardNumber);

  if (digits.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  return 'Tarjeta';
}

function maskCardNumber(cardNumber) {
  const digits = onlyDigits(cardNumber);

  if (!digits) return '0000 0000 0000 0000';

  const visible = digits.slice(-4).padStart(4, '0');
  return `**** **** **** ${visible}`;
}

function isExpiryValid(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [monthValue, yearValue] = expiry.split('/').map(Number);
  if (monthValue < 1 || monthValue > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = Number(String(now.getFullYear()).slice(-2));

  return yearValue > currentYear || (yearValue === currentYear && monthValue >= currentMonth);
}

function validatePayment(form) {
  const nextErrors = {};
  const cardDigits = onlyDigits(form.cardNumber);

  if (form.name.trim().length < 3) {
    nextErrors.name = 'Escribe el titular de la tarjeta.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = 'Escribe un email valido.';
  }

  if (cardDigits.length !== 16) {
    nextErrors.cardNumber = 'La tarjeta debe tener 16 digitos.';
  }

  if (!isExpiryValid(form.expiry)) {
    nextErrors.expiry = 'Usa una fecha MM/AA valida.';
  }

  if (!/^\d{3,4}$/.test(form.cvv)) {
    nextErrors.cvv = 'El CVV debe tener 3 o 4 digitos.';
  }

  if (form.address.trim().length < 5) {
    nextErrors.address = 'Escribe una direccion valida.';
  }

  if (form.city.trim().length < 2) {
    nextErrors.city = 'Escribe la ciudad.';
  }

  if (form.postalCode.trim().length < 4) {
    nextErrors.postalCode = 'Escribe el codigo postal.';
  }

  return nextErrors;
}

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const shipping = cartSubtotal >= 49 || cartItems.length === 0 ? 0 : 4.99;
  const total = cartSubtotal + shipping;
  const cardBrand = useMemo(() => getCardBrand(form.cardNumber), [form.cardNumber]);


  function updateField(field, value) {
    const formatters = {
      cardNumber: formatCardNumber,
      expiry: formatExpiry,
      cvv: (nextValue) => onlyDigits(nextValue).slice(0, 4),
      postalCode: (nextValue) => nextValue.slice(0, 10),
    };

    const nextValue = formatters[field] ? formatters[field](value) : value;

    setForm((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => {
      const { [field]: _removed, ...rest } = current;
      return rest;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validatePayment(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Revisa los datos de pago.');
      return;
    }

    setProcessing(true);

    const direccionEnvio = `${form.address.trim()}, ${form.city.trim()} (${form.postalCode.trim()})`;

    try {
      const { data } = await api.post('/api/orders', {
        email: form.email.trim(),
        direccion_envio: direccionEnvio,
        items: cartItems.map((item) => ({
          id_producto: item.id,
          cantidad: item.cantidad,
          formato: item.talla,
        })),
      });

      setCompletedOrder({
        number: `FM-${String(data.order.id_pedido).padStart(6, '0')}`,
        email: form.email.trim(),
        items: cartItems,
        subtotal: data.order.subtotal,
        shipping: data.order.envio,
        total: data.order.total,
        paidAt: new Date().toLocaleString('es-ES'),
      });
      clearCart();
      toast.success(data.emailSent ? 'Pedido realizado y email enviado' : 'Pedido realizado correctamente');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo crear el pedido.');
    } finally {
      setProcessing(false);
    }
  }

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl font-black text-black">
              ✓
            </div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              Pago exitoso
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tight md:text-5xl">
              Pedido confirmado
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Tu pedido se ha registrado correctamente. Hemos enviado la confirmacion a {completedOrder.email}.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Pedido</p>
              <p className="mt-2 text-lg font-black">{completedOrder.number}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Fecha</p>
              <p className="mt-2 text-lg font-black">{completedOrder.paidAt}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Total pagado</p>
              <p className="mt-2 text-lg font-black">{currency(completedOrder.total)} EUR</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-black uppercase">Resumen</h2>
            <div className="mt-4 space-y-3">
              {completedOrder.items.map((item) => (
                <div
                  key={`${item.id}-${item.talla}`}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-bold text-white">{item.nombre}</p>
                    <p className="text-white/45">
                      {item.talla} x {item.cantidad}
                    </p>
                  </div>
                  <p className="font-black">{currency(Number(item.precio) * Number(item.cantidad))} EUR</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="cursor-pointer rounded-xl px-7 py-3 text-center text-sm font-black uppercase tracking-widest text-white transition hover:brightness-110"
              style={{ backgroundColor: '#D30F15' }}
            >
              Seguir comprando
            </Link>
            <Link
              to="/"
              className="cursor-pointer rounded-xl border border-white/15 px-7 py-3 text-center text-sm font-black uppercase tracking-widest text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tight md:text-5xl">
            No hay productos para pagar
          </h1>
          <p className="mb-8 text-white/50">Anade productos al carrito antes de continuar.</p>
          <Link
            to="/products"
            className="inline-block cursor-pointer rounded-xl px-7 py-3 text-sm font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: '#D30F15' }}
          >
            Ir a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-red-400">Checkout</p>
            <h1 className="text-3xl font-black uppercase italic tracking-tight md:text-5xl">
              Finalizar compra
            </h1>
          </div>
          <Link
            to="/cart"
            className="w-fit cursor-pointer rounded-xl border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Volver al carrito
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-950 to-red-950 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black uppercase tracking-widest text-white/70">{cardBrand}</p>
                  <p className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/60">
                    Demo
                  </p>
                </div>
                <p className="mt-10 text-2xl font-black tracking-widest md:text-3xl">
                  {maskCardNumber(form.cardNumber)}
                </p>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Titular</p>
                    <p className="mt-1 min-h-6 font-black uppercase">{form.name || 'Nombre Apellido'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Caduca</p>
                    <p className="mt-1 min-h-6 font-black">{form.expiry || 'MM/AA'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Titular de la tarjeta
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className={inputClass}
                    placeholder="Alex FitMeal"
                    autoComplete="cc-name"
                  />
                  {errors.name && <span className="mt-2 block text-xs text-red-300">{errors.name}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Email</span>
                  <input
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className={inputClass}
                    placeholder="cliente@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="mt-2 block text-xs text-red-300">{errors.email}</span>}
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Numero de tarjeta
                  </span>
                  <input
                    value={form.cardNumber}
                    onChange={(event) => updateField('cardNumber', event.target.value)}
                    className={inputClass}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  {errors.cardNumber && <span className="mt-2 block text-xs text-red-300">{errors.cardNumber}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Caducidad</span>
                  <input
                    value={form.expiry}
                    onChange={(event) => updateField('expiry', event.target.value)}
                    className={inputClass}
                    placeholder="12/28"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {errors.expiry && <span className="mt-2 block text-xs text-red-300">{errors.expiry}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">CVV</span>
                  <input
                    value={form.cvv}
                    onChange={(event) => updateField('cvv', event.target.value)}
                    className={inputClass}
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {errors.cvv && <span className="mt-2 block text-xs text-red-300">{errors.cvv}</span>}
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Direccion de envio
                  </span>
                  <input
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    className={inputClass}
                    placeholder="Calle FitMeal 12"
                    autoComplete="street-address"
                  />
                  {errors.address && <span className="mt-2 block text-xs text-red-300">{errors.address}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Ciudad</span>
                  <input
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    className={inputClass}
                    placeholder="Madrid"
                    autoComplete="address-level2"
                  />
                  {errors.city && <span className="mt-2 block text-xs text-red-300">{errors.city}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Codigo postal
                  </span>
                  <input
                    value={form.postalCode}
                    onChange={(event) => updateField('postalCode', event.target.value)}
                    className={inputClass}
                    placeholder="28001"
                    autoComplete="postal-code"
                  />
                  {errors.postalCode && <span className="mt-2 block text-xs text-red-300">{errors.postalCode}</span>}
                </label>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="mt-6 w-full cursor-pointer rounded-xl py-4 text-sm font-black uppercase tracking-widest text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: '#D30F15' }}
              >
                {processing ? 'Procesando pago...' : `Pagar ${currency(total)} EUR`}
              </button>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:sticky lg:top-24">
            <h2 className="text-xl font-black uppercase">Resumen</h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.talla}`} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black uppercase">{item.nombre}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {item.talla} x {item.cantidad}
                    </p>
                    <p className="mt-2 text-sm font-bold">
                      {currency(Number(item.precio) * Number(item.cantidad))} EUR
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-white/10" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>{currency(cartSubtotal)} EUR</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Envio</span>
                <span>{shipping === 0 ? 'Gratis' : `${currency(shipping)} EUR`}</span>
              </div>
              <div className="flex items-center justify-between pt-3 text-white">
                <span className="font-black uppercase">Total</span>
                <span className="text-2xl font-black">{currency(total)} EUR</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
