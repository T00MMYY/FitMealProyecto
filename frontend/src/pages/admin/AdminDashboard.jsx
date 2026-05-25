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
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-black italic uppercase mb-6 md:mb-8">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard title="Usuarios Totales" value={stats.totalUsers} />
          <StatCard title="Recetas" value={stats.totalRecipes} />
          <div className="col-span-2 lg:col-span-1">
            <StatCard title="Ejercicios" value={stats.totalExercises} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-[#0d0d0d] p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/5 shadow-xl h-full flex flex-col justify-between">
    <div className="text-3xl md:text-5xl font-black text-red-600 mb-1 md:mb-2">{value}</div>
    <div className="text-[10px] md:text-xs uppercase text-white/40 tracking-[0.15em] md:tracking-[0.2em] font-bold">
      {title}
    </div>
  </div>
);

export default AdminDashboard;