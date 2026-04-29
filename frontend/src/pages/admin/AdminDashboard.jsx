import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, totalRecipes: 0, totalExercises: 0, objetivos: {}, userGrowth: [], topRecipes: [], topExercises: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) { console.error('Usando datos de prueba'); }
    };
    fetchStats();
  }, []);

  const objetivosData = [
    { name: 'Perder Grasa', value: stats.objetivos.perderGrasa || 0 },
    { name: 'Ganar Músculo', value: stats.objetivos.ganarMusculo || 0 },
    { name: 'Mantener', value: stats.objetivos.mantener || 0 }
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Dashboard</h1>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Usuarios Totales" value={stats.totalUsers} />
          <StatCard title="Recetas" value={stats.totalRecipes} />
          <StatCard title="Ejercicios" value={stats.totalExercises} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribución de Objetivos */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Distribución de Objetivos</h2>
            <PieChart width={400} height={300}>
              <Pie data={objetivosData} cx={200} cy={150} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {objetivosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Crecimiento de Usuarios */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Crecimiento de Usuarios</h2>
            <LineChart width={400} height={300} data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registros" stroke="#FF6B6B" />
            </LineChart>
          </div>

          {/* Top Recetas */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Top Recetas</h2>
            <ul>
              {stats.topRecipes.map((recipe, index) => (
                <li key={recipe.id_receta} className="flex justify-between py-2">
                  <span>{index + 1}. {recipe.titulo}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Ejercicios */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Top Ejercicios</h2>
            <ul>
              {stats.topExercises.map((exercise, index) => (
                <li key={exercise.id} className="flex justify-between py-2">
                  <span>{index + 1}. {exercise.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-[#0d0d0d] p-8 rounded-2xl border border-white/5">
    <div className="text-4xl font-black text-red-600 mb-1">{value}</div>
    <div className="text-xs uppercase text-white/40 tracking-[0.2em] font-bold">{title}</div>
  </div>
);

export default AdminDashboard;