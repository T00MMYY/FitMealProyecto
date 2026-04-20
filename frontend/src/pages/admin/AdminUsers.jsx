import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) { console.log("Error al cargar usuarios"); }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-black italic uppercase mb-8">Usuarios</h1>
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-white/40 text-xs uppercase">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(u => (
                <tr key={u.id_usuario} className="border-t border-white/5">
                  <td className="p-4">{u.nombre}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.id_rol === 1 ? 'Admin' : 'Usuario'}</td>
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