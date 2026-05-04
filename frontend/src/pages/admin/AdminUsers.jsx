import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) { console.log("Error al cargar usuarios"); }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { id_rol: newRole });
      fetchUsers();
      toast.success('Rol actualizado correctamente');
    } catch (error) { 
      toast.error('Error al cambiar rol');
      console.log("Error al cambiar rol"); 
    }
  };

  const handleBan = async (id) => {
    if (window.confirm('¿Banear usuario?')) {
      try {
        await api.put(`/api/admin/users/${id}/ban`);
        fetchUsers();
        toast.success('Usuario baneado correctamente');
      } catch (error) { 
        toast.error('Error al banear usuario');
        console.log("Error al banear"); 
      }
    }
  };

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
                <th className="p-5 font-bold border-b border-white/5">Rol</th>
                <th className="p-5 font-bold border-b border-white/5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(u => (
                <tr key={u.id_usuario} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-medium">{u.nombre}</td>
                  <td className="p-5 text-white/60">{u.email}</td>
                  <td className="p-5">
                    <select 
                      value={u.id_rol} 
                      onChange={(e) => handleRoleChange(u.id_usuario, e.target.value)}
                      className="bg-[#1a1a1a] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>Usuario</option>
                      <option value={3}>Premium</option>
                    </select>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleBan(u.id_usuario)} className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg">
                      Banear
                    </button>
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