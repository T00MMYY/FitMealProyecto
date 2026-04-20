import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/api/admin/recipes');
        setRecipes(response.data);
      } catch (error) { console.log("Error al cargar recetas"); }
    };
    fetchRecipes();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic uppercase">Recetas</h1>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs">
            + Añadir Nueva
          </button>
        </div>
        <div className="grid gap-4">
          {recipes.length > 0 ? recipes.map(re => (
            <div key={re.id_receta} className="bg-[#0d0d0d] p-4 border border-white/5 rounded-xl flex justify-between">
              <span>{re.titulo}</span>
              <span className="text-red-500 font-bold">{re.calorias} kcal</span>
            </div>
          )) : <p className="text-white/20 italic">No hay recetas añadidas</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRecipes;