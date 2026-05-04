import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalExercises: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        // Extraemos solo lo necesario del response
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalRecipes: response.data.totalRecipes || 0,
          totalExercises: response.data.totalExercises || 0
        });
      } catch (error) {
        console.error('Error al cargar estadísticas');
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Dashboard</h1>

        {/* Tarjetas de estadísticas simplificadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Usuarios Totales" value={stats.totalUsers} />
          <StatCard title="Recetas" value={stats.totalRecipes} />
          <StatCard title="Ejercicios" value={stats.totalExercises} />
        </div>
      </div>
    </AdminLayout>
  );
};

// Componente de Tarjeta reutilizable
const StatCard = ({ title, value }) => (
  <div className="bg-[#0d0d0d] p-8 rounded-2xl border border-white/5 shadow-xl">
    <div className="text-5xl font-black text-red-600 mb-2">{value}</div>
    <div className="text-xs uppercase text-white/40 tracking-[0.2em] font-bold">
      {title}
    </div>
  </div>
);

export default AdminDashboard;