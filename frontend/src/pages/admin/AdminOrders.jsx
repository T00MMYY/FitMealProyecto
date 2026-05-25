import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders/all')
      .then(res => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Pedidos</h1>

        {loading ? (
          <p className="text-white/40">Cargando...</p>
        ) : orders.length === 0 ? (
          <p className="text-white/40">No hay pedidos.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase text-xs tracking-widest">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id_pedido} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-white/60">FM-{String(order.id_pedido).padStart(6, '0')}</td>
                    <td className="px-4 py-3 font-medium">{order.nombre}</td>
                    <td className="px-4 py-3 text-white/60">{order.email}</td>
                    <td className="px-4 py-3 text-white/60">{new Date(order.fecha_pedido).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3 font-bold text-red-500">{Number(order.total).toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 uppercase tracking-wider">
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 max-w-xs truncate">{order.direccion_envio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
