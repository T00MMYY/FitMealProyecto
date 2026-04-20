import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminExercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/api/admin/exercises');
        setExercises(response.data);
      } catch (error) { console.log("Error al cargar ejercicios"); }
    };
    fetchExercises();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic uppercase">Ejercicios</h1>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs">
            + Añadir Nuevo
          </button>
        </div>
        <div className="grid gap-4">
          {exercises.length > 0 ? exercises.map(ex => (
            <div key={ex.id} className="bg-[#0d0d0d] p-4 border border-white/5 rounded-xl flex justify-between">
              <span>{ex.titulo}</span>
              <span className="text-white/40">{ex.grupo_muscular}</span>
            </div>
          )) : <p className="text-white/20 italic">No hay ejercicios añadidos</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminExercises;