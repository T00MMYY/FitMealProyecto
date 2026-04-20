import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id_rol === 1) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`, { id_rol: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/api/admin/users/${userId}/status`, { estado_cuenta: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    }
  };

  if (user?.id_rol !== 1) {
    return (
      <AdminLayout>
        <div className="text-white text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-white/60">No tienes permisos para acceder a esta sección.</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="border-b border-white/5 p-6">
        <h1 className="text-4xl font-black italic uppercase">Gestión de Usuarios</h1>
        <p className="text-white/40 mt-2">Administra la comunidad de usuarios</p>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-primary font-black text-center py-12">CARGANDO...</div>
        ) : (
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#141414] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Usuario</th>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Email</th>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Objetivo</th>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Rol</th>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Estado</th>
                    <th className="px-6 py-4 text-left text-white/60 font-bold uppercase text-xs tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id_usuario} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold">{u.nombre} {u.apellidos}</div>
                          <div className="text-white/40 text-sm">ID: {u.id_usuario}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          u.objetivo === 'perder_grasa' ? 'bg-red-500/20 text-red-400' :
                          u.objetivo === 'ganar_musculo' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {u.objetivo?.replace('_', ' ') || 'No definido'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.id_rol}
                          onChange={(e) => handleRoleChange(u.id_usuario, parseInt(e.target.value))}
                          className="bg-[#1f2937] border border-white/10 rounded px-3 py-1 text-sm"
                        >
                          <option value={2}>Usuario</option>
                          <option value={1}>Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          u.estado_cuenta === 'activo' ? 'bg-green-500/20 text-green-400' :
                          u.estado_cuenta === 'baneado' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {u.estado_cuenta}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {u.estado_cuenta === 'activo' ? (
                            <button
                              onClick={() => handleStatusChange(u.id_usuario, 'baneado')}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold hover:bg-red-500/30"
                            >
                              Banear
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(u.id_usuario, 'activo')}
                              className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold hover:bg-green-500/30"
                            >
                              Activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;