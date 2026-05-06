import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { id_rol: newRole });
      fetchUsers();
      toast.success('Rol actualizado correctamente');
    } catch (error) {
      toast.error('Error al cambiar rol');
    }
  };

  const handleBan = async (u) => {
    const isBanned = u.estado_cuenta === 'baneado';
    const msg = isBanned ? `¿Desbanear a ${u.nombre}?` : `¿Banear a ${u.nombre}?`;
    if (!window.confirm(msg)) return;
    try {
      const res = await api.put(`/api/admin/users/${u.id_usuario}/ban`);
      setUsers(prev => prev.map(x => x.id_usuario === u.id_usuario ? { ...x, estado_cuenta: res.data.estado } : x));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`¿Eliminar permanentemente a ${u.nombre} (${u.email})? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/api/admin/users/${u.id_usuario}`);
      setUsers(prev => prev.filter(x => x.id_usuario !== u.id_usuario));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const isSelf = (u) => u.id_usuario === currentUser?.id_usuario;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Usuarios</h1>
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] text-white/40 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="p-5 font-bold border-b border-white/5">Nombre</th>
                <th className="p-5 font-bold border-b border-white/5">Email</th>
                <th className="p-5 font-bold border-b border-white/5">Estado</th>
                <th className="p-5 font-bold border-b border-white/5">Rol</th>
                <th className="p-5 font-bold border-b border-white/5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(u => (
                <tr key={u.id_usuario} className={`border-b border-white/5 transition-colors ${u.estado_cuenta === 'baneado' ? 'bg-red-950/20' : 'hover:bg-white/[0.02]'}`}>
                  <td className="p-5 font-medium">
                    {u.nombre} {u.apellidos}
                    {isSelf(u) && <span className="ml-2 text-[10px] text-white/30 uppercase tracking-widest">(tú)</span>}
                  </td>
                  <td className="p-5 text-white/60">{u.email}</td>
                  <td className="p-5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                      u.estado_cuenta === 'baneado'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {u.estado_cuenta}
                    </span>
                  </td>
                  <td className="p-5">
                    <select
                      value={u.id_rol}
                      onChange={(e) => handleRoleChange(u.id_usuario, e.target.value)}
                      disabled={isSelf(u)}
                      className="bg-[#1a1a1a] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>Usuario</option>
                      <option value={3}>Premium</option>
                    </select>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isSelf(u) && (
                        <>
                          <button
                            onClick={() => handleBan(u)}
                            className={`font-bold text-xs uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg ${
                              u.estado_cuenta === 'baneado'
                                ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20'
                                : 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20'
                            }`}
                          >
                            {u.estado_cuenta === 'baneado' ? 'Desbanear' : 'Banear'}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
