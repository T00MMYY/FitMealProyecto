import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function currency(value) {
  return Number(value).toFixed(2);
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MisPedidos() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/orders/mine')
      .then((response) => setOrders(response.data.orders || []))
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  async function toggleOrder(id) {
    if (selectedOrderId === id) {
      setSelectedOrderId(null);
      return;
    }

    setSelectedOrderId(id);

    if (details[id]) {
      return;
    }

    setLoadingDetail(true);
    try {
      const response = await api.get(`/api/orders/${id}`);
      setDetails((current) => ({
        ...current,
        [id]: response.data.order,
      }));
    } catch {
      setDetails((current) => ({
        ...current,
        [id]: { error: 'No se pudo cargar el detalle.' },
      }));
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-red-400">Cuenta</p>
            <h1 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">Mis pedidos</h1>
          </div>
          <Link
            to="/products"
            className="w-fit rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: '#D30F15' }}
          >
            Ver productos
          </Link>
        </div>

        {loading && (
          <p className="py-16 text-center text-sm font-bold uppercase tracking-widest text-white/40">Cargando...</p>
        )}

        {error && (
          <p className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-center text-red-200">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-2xl font-black uppercase italic">Aun no tienes pedidos</p>
            <p className="mt-2 text-white/45">Cuando completes una compra aparecera aqui.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const isOpen = selectedOrderId === order.id_pedido;
              const detail = details[order.id_pedido];

              return (
                <article key={order.id_pedido} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <button
                    type="button"
                    onClick={() => toggleOrder(order.id_pedido)}
                    className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/35">
                        Pedido FM-{String(order.id_pedido).padStart(6, '0')}
                      </p>
                      <p className="mt-1 font-bold text-white">{formatDate(order.fecha_pedido)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black uppercase text-green-300">
                        {order.estado}
                      </span>
                      <span className="text-xl font-black">{currency(order.total)} EUR</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 p-5">
                      {loadingDetail && !detail && (
                        <p className="text-sm text-white/45">Cargando detalle...</p>
                      )}

                      {detail?.error && (
                        <p className="text-sm text-red-300">{detail.error}</p>
                      )}

                      {detail?.items && (
                        <div className="space-y-3">
                          {detail.items.map((item) => (
                            <div key={item.id_detalle} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                              <div>
                                <p className="font-bold">{item.nombre_producto}</p>
                                <p className="text-sm text-white/45">
                                  {item.cantidad} x {currency(item.precio_unitario)} EUR
                                </p>
                              </div>
                              <p className="font-black">{currency(item.subtotal)} EUR</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
