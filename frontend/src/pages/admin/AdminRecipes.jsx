import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', ingredientes: '', instrucciones: '', tiempo: '', tipo: '', calorias: '', proteina: '', carbohidratos: '', grasas: '', imagen: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/api/admin/recipes');
      setRecipes(response.data);
    } catch (error) { console.log("Error al cargar recetas"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await api.put(`/api/admin/recipes/${editingRecipe.id_receta}`, formData);
        toast.success('Receta actualizada correctamente');
      } else {
        await api.post('/api/admin/recipes', formData);
        toast.success('Receta creada correctamente');
      }
      fetchRecipes();
      setShowModal(false);
      setEditingRecipe(null);
      setFormData({ titulo: '', ingredientes: '', instrucciones: '', tiempo: '', tipo: '', calorias: '', proteina: '', carbohidratos: '', grasas: '', imagen: '' });
    } catch (error) { 
      toast.error('Error al guardar receta');
      console.log("Error al guardar receta"); 
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      titulo: recipe.titulo || '',
      ingredientes: recipe.ingredientes || '',
      instrucciones: recipe.instrucciones || '',
      tiempo: recipe.tiempo || '',
      tipo: recipe.tipo || '',
      calorias: recipe.calorias || '',
      proteina: recipe.proteina || '',
      carbohidratos: recipe.carbohidratos || '',
      grasas: recipe.grasas || '',
      imagen: recipe.imagen || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
      try {
        await api.delete(`/api/admin/recipes/${id}`);
        fetchRecipes();
        toast.success('Receta eliminada correctamente');
      } catch (error) { 
        toast.error('Error al eliminar receta');
        console.log("Error al eliminar receta"); 
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        
        {/* CABECERA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-black italic uppercase">Recetas</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-3 sm:py-2 rounded-full font-bold uppercase text-xs w-full sm:w-auto text-center"
          >
            + Añadir Nueva
          </button>
        </div>

        <div className="grid gap-4">
          {recipes.length > 0 ? recipes.map(re => (
            <div key={re.id_receta} className="bg-[#0d0d0d] p-5 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="flex flex-col gap-1 min-w-0 w-full">
                <span className="font-bold text-lg truncate block text-white">{re.titulo}</span>
                <div className="flex gap-4 text-xs font-medium">
                  <span className="text-red-500">{re.calorias} kcal</span>
                  <span className="text-white/40">{re.tiempo_preparacion || re.tiempo} min</span>
                </div>
              </div>
              
              <div className="flex gap-4 border-t border-white/5 pt-3 sm:pt-0 sm:border-none justify-end w-full sm:w-auto">
                <button onClick={() => handleEdit(re)} className="text-blue-400 hover:text-blue-300 transition-colors uppercase text-xs font-bold tracking-wider py-1">Editar</button>
                <button onClick={() => handleDelete(re.id_receta)} className="text-red-500 hover:text-red-400 transition-colors uppercase text-xs font-bold tracking-wider py-1">Borrar</button>
              </div>
            </div>
          )) : <p className="text-white/20 italic">No hay recetas añadidas</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-[#121212] border border-white/10 p-5 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar mx-2">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-red-600 rounded-b-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

              <h2 className="text-2xl font-black italic text-white mb-6 uppercase tracking-wider">
                {editingRecipe ? 'Editar' : 'Crear'} <span className="text-red-600">Receta</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Nombre de la receta</label>
                  <input 
                    type="text" 
                    placeholder="Título de la receta" 
                    value={formData.titulo} 
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm md:text-base" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Tiempo (min)</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 20" 
                      value={formData.tiempo} 
                      onChange={(e) => setFormData({...formData, tiempo: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm md:text-base" 
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Tipo</label>
                    <select 
                      value={formData.tipo} 
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})} 
                      className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm md:text-base cursor-pointer" 
                      required
                    >
                      <option value="" className="text-gray-500">Tipo</option>
                      <option value="Desayuno">Desayuno</option>
                      <option value="Almuerzo">Almuerzo</option>
                      <option value="Cena">Cena</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Macros</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-semibold text-white/30 ml-1">Calorías</span>
                      <input 
                        type="number" 
                        placeholder="Kcal" 
                        value={formData.calorias} 
                        onChange={(e) => setFormData({...formData, calorias: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-semibold text-white/30 ml-1">Proteínas</span>
                      <input 
                        type="number" 
                        placeholder="Prot (g)" 
                        value={formData.proteina} 
                        onChange={(e) => setFormData({...formData, proteina: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-semibold text-white/30 ml-1">Carbohidratos</span>
                      <input 
                        type="number" 
                        placeholder="Carb (g)" 
                        value={formData.carbohidratos} 
                        onChange={(e) => setFormData({...formData, carbohidratos: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-semibold text-white/30 ml-1">Grasas</span>
                      <input 
                        type="number" 
                        placeholder="Gras (g)" 
                        value={formData.grasas} 
                        onChange={(e) => setFormData({...formData, grasas: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                      />
                    </div>

                  </div>
                </div>

                <div className="space-y-3">
                  <textarea 
                    placeholder="Ingredientes (separados por coma)" 
                    value={formData.ingredientes} 
                    onChange={(e) => setFormData({...formData, ingredientes: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-20 resize-none focus:outline-none focus:border-red-600 transition-all text-sm md:text-base" 
                  />
                  <textarea 
                    placeholder="Instrucciones paso a paso" 
                    value={formData.instructions || formData.instrucciones} 
                    onChange={(e) => setFormData({...formData, instrucciones: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-24 resize-none focus:outline-none focus:border-red-600 transition-all text-sm md:text-base" 
                  />
                  <input 
                    type="text" 
                    placeholder="URL Imagen" 
                    value={formData.imagen} 
                    onChange={(e) => setFormData({...formData, imagen: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all text-sm md:text-base" 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5 text-xs md:text-sm"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 text-xs md:text-sm"
                  >
                    GUARDAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecipes;