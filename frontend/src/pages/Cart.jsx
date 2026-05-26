import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function currency(value) {
  return Number(value).toFixed(2);
}

export default function Cart() {
  const {
    cartItems,
    cartSubtotal,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const shipping = cartSubtotal >= 49 || cartItems.length === 0 ? 0 : 4.99;
  const total = cartSubtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4">
            Tu carrito esta vacio
          </h1>
          <p className="text-white/50 mb-8">
            Anade productos desde la tienda para verlos aqui.
          </p>
          <Link
            to="/products"
            className="inline-block px-7 py-3 rounded-xl font-black uppercase tracking-widest text-sm"
            style={{ backgroundColor: '#D30F15' }}
          >
            Ir a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">
            Carrito
          </h1>
          <button
            onClick={clearCart}
            className="px-5 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-xs uppercase tracking-widest font-bold"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const formato = item.formato || item.talla || 'Estándar';
              return (
                <article
                  key={`${item.id}-${formato}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5 flex flex-col md:flex-row gap-4"
                >
                  <div className="w-full h-48 md:w-36 md:h-36 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-black uppercase tracking-wide">{item.nombre}</p>
                    <p className="text-white/50 text-sm mt-1">Formato: {formato}</p>
                    <p className="text-white font-bold mt-3">{currency(item.precio)} EUR / ud</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, formato, item.cantidad - 1)}
                          className="w-9 h-9 rounded-lg border border-white/15 text-white/80 hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{item.cantidad}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, formato, item.cantidad + 1)}
                          className="w-9 h-9 rounded-lg border border-white/15 text-white/80 hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, formato)}
                        className="text-red-400 hover:text-red-300 text-xs uppercase tracking-widest font-bold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-black uppercase mb-4">Resumen</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>{currency(cartSubtotal)} EUR</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Envio</span>
                <span>{shipping === 0 ? 'Gratis' : `${currency(shipping)} EUR`}</span>
              </div>
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-white/80">Total</span>
              <span className="text-2xl font-black">{currency(total)} EUR</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full cursor-pointer py-3 rounded-xl text-center font-black uppercase tracking-widest text-sm hover:brightness-110 transition"
              style={{ backgroundColor: '#D30F15' }}
            >
              Finalizar compra
            </Link>

            <Link
              to="/products"
              className="block text-center mt-4 text-white/60 hover:text-white text-xs uppercase tracking-widest"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
