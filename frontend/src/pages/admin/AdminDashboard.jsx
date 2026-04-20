import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, totalRecipes: 0, totalExercises: 0
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Dashboard</h1>

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