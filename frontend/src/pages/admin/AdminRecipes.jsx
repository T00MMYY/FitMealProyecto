import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', instrucciones: '', tiempo_preparacion: '', dificultad: '', calorias: '', proteinas: '', carbohidratos: '', grasas: '', imagen: ''
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
      setFormData({ titulo: '', descripcion: '', instrucciones: '', tiempo_preparacion: '', dificultad: '', calorias: '', proteinas: '', carbohidratos: '', grasas: '', imagen: '' });
    } catch (error) { 
      toast.error('Error al guardar receta');
      console.log("Error al guardar receta"); 
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      titulo: recipe.titulo,
      descripcion: recipe.descripcion,
      instrucciones: recipe.instrucciones,
      tiempo_preparacion: recipe.tiempo_preparacion,
      dificultad: recipe.dificultad,
      calorias: recipe.calorias,
      proteinas: recipe.proteinas,
      carbohidratos: recipe.carbohidratos,
      grasas: recipe.grasas,
      imagen: recipe.imagen
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic uppercase">Recetas</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs"
          >
            + Añadir Nueva
          </button>
        </div>
        <div className="grid gap-4">
          {recipes.length > 0 ? recipes.map(re => (
            <div key={re.id_receta} className="bg-[#0d0d0d] p-4 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold">{re.titulo}</span>
                <span className="text-red-500 font-bold ml-4">{re.calorias} kcal</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(re)} className="text-blue-500">Editar</button>
                <button onClick={() => handleDelete(re.id_receta)} className="text-red-500">Borrar</button>
              </div>
            </div>
          )) : <p className="text-white/20 italic">No hay recetas añadidas</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#0d0d0d] p-6 rounded-2xl w-96 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{editingRecipe ? 'Editar Receta' : 'Nueva Receta'}</h2>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  placeholder="Título" 
                  value={formData.titulo} 
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                  required 
                />
                <textarea 
                  placeholder="Descripción" 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <textarea 
                  placeholder="Instrucciones" 
                  value={formData.instrucciones} 
                  onChange={(e) => setFormData({...formData, instrucciones: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="number" 
                  placeholder="Tiempo Preparación (min)" 
                  value={formData.tiempo_preparacion} 
                  onChange={(e) => setFormData({...formData, tiempo_preparacion: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <select 
                  value={formData.dificultad} 
                  onChange={(e) => setFormData({...formData, dificultad: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                >
                  <option value="">Dificultad</option>
                  <option value="facil">Fácil</option>
                  <option value="medio">Medio</option>
                  <option value="dificil">Difícil</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Calorías" 
                  value={formData.calorias} 
                  onChange={(e) => setFormData({...formData, calorias: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="number" 
                  placeholder="Proteínas (g)" 
                  value={formData.proteinas} 
                  onChange={(e) => setFormData({...formData, proteinas: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="number" 
                  placeholder="Carbohidratos (g)" 
                  value={formData.carbohidratos} 
                  onChange={(e) => setFormData({...formData, carbohidratos: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="number" 
                  placeholder="Grasas (g)" 
                  value={formData.grasas} 
                  onChange={(e) => setFormData({...formData, grasas: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="text" 
                  placeholder="URL Imagen" 
                  value={formData.imagen} 
                  onChange={(e) => setFormData({...formData, imagen: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Guardar</button>
                  <button type="button" onClick={() => setShowModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
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