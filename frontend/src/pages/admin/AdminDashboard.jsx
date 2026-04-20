import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // 1. Datos de prueba por si el servidor falla o está vacío
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalExercises: 0,
    objetivos: { perderGrasa: 0, ganarMusculo: 0, mantener: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error cargando stats, usando datos locales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 2. Preparar datos para las gráficas
  const objetivosData = [
    { name: 'Perder Grasa', value: stats.objetivos?.perderGrasa || 0, color: '#ef4444' },
    { name: 'Ganar Músculo', value: stats.objetivos?.ganarMusculo || 0, color: '#10b981' },
    { name: 'Mantener', value: stats.objetivos?.mantener || 0, color: '#f59e0b' }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-black italic uppercase mb-6">Panel de Control</h1>

      </div>
    </AdminLayout>
  );
};

// Sub-componente pequeño para no repetir código de las tarjetitas
const StatCard = ({ title, value }) => (
  <div className="bg-[#0d0d0d] p-6 rounded-xl border border-white/5">
    <div className="text-2xl font-black text-red-600">{value}</div>
    <div className="text-xs uppercase text-white/40 tracking-widest">{title}</div>
  </div>
);

export default AdminDashboard;