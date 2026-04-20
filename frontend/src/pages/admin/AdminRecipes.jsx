import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    instrucciones: '',
    tiempo_preparacion: '',
    dificultad: 'Fácil',
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    imagen: ''
  });

  useEffect(() => {
    if (user?.id_rol === 1) {
      fetchRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/api/admin/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await api.put(`/api/admin/recipes/${editingRecipe.id_receta}`, formData);
      } else {
        await api.post('/api/admin/recipes', formData);
      }
      fetchRecipes();
      setShowForm(false);
      setEditingRecipe(null);
      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error al guardar la receta');
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await api.delete(`/api/admin/recipes/${id}`);
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Error al eliminar la receta');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      instrucciones: '',
      tiempo_preparacion: '',
      dificultad: 'Fácil',
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: '',
      imagen: ''
    });
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
      <div className="border-b border-white/5 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase">Gestión de Recetas</h1>
          <p className="text-white/40 mt-2">Administra el contenido de recetas</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingRecipe(null);
              resetForm();
            }
          }}
          className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/80 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nueva Receta'}
        </button>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/5 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingRecipe ? 'Editar Receta' : 'Nueva Receta'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1">Instrucciones</label>
                <textarea
                  value={formData.instrucciones}
                  onChange={(e) => setFormData({...formData, instrucciones: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Tiempo de Preparación (min)</label>
                <input
                  type="number"
                  value={formData.tiempo_preparacion}
                  onChange={(e) => setFormData({...formData, tiempo_preparacion: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Dificultad</label>
                <select
                  value={formData.dificultad}
                  onChange={(e) => setFormData({...formData, dificultad: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1">Calorías</label>
                <input
                  type="number"
                  value={formData.calorias}
                  onChange={(e) => setFormData({...formData, calorias: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Proteínas (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.proteinas}
                  onChange={(e) => setFormData({...formData, proteinas: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Carbohidratos (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.carbohidratos}
                  onChange={(e) => setFormData({...formData, carbohidratos: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Grasas (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.grasas}
                  onChange={(e) => setFormData({...formData, grasas: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/80"
                >
                  {editingRecipe ? 'Actualizar' : 'Crear'} Receta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecipe(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-primary font-black text-center py-12">CARGANDO...</div>
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id_receta} className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/5">
                <div className="flex">
                  <img
                    src={recipe.imagen || `https://via.placeholder.com/200x150?text=${recipe.titulo}`}
                    alt={recipe.titulo}
                    className="w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{recipe.titulo}</h3>
                        <p className="text-white/60 text-sm mt-1">{recipe.descripcion}</p>
                        <div className="flex gap-4 mt-2 text-sm text-white/40">
                          <span>{recipe.tiempo_preparacion} min</span>
                          <span>{recipe.dificultad}</span>
                          <span>{recipe.calorias} cal</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(recipe)}
                          className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.id_receta)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecipes;