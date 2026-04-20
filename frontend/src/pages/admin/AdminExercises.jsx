import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminExercises = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    grupo_muscular: '',
    dificultad: 'Principiante',
    descripcion: '',
    imagen: '',
    video_url: ''
  });

  useEffect(() => {
    if (user?.id_rol === 1) {
      fetchExercises();
    }
  }, [user]);

  const fetchExercises = async () => {
    try {
      const response = await api.get('/api/admin/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await api.put(`/api/admin/exercises/${editingExercise.id_ejercicio}`, formData);
      } else {
        await api.post('/api/admin/exercises', formData);
      }
      fetchExercises();
      setShowForm(false);
      setEditingExercise(null);
      resetForm();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error al guardar el ejercicio');
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      titulo: exercise.titulo,
      grupo_muscular: exercise.grupo_muscular,
      dificultad: exercise.dificultad,
      descripcion: exercise.descripcion,
      imagen: exercise.imagen,
      video_url: exercise.video_url
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
      try {
        await api.delete(`/api/admin/exercises/${id}`);
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error al eliminar el ejercicio');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      grupo_muscular: '',
      dificultad: 'Principiante',
      descripcion: '',
      imagen: '',
      video_url: ''
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
          <h1 className="text-4xl font-black italic uppercase">Gestión de Ejercicios</h1>
          <p className="text-white/40 mt-2">Administra la base de datos de ejercicios</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingExercise(null);
              resetForm();
            }
          }}
          className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/80 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Ejercicio'}
        </button>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/5 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
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

              <div>
                <label className="block text-white/60 mb-1">Grupo Muscular</label>
                <select
                  value={formData.grupo_muscular}
                  onChange={(e) => setFormData({...formData, grupo_muscular: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Espalda">Espalda</option>
                  <option value="Hombros">Hombros</option>
                  <option value="Bíceps">Bíceps</option>
                  <option value="Tríceps">Tríceps</option>
                  <option value="Cuádriceps">Cuádriceps</option>
                  <option value="Femoral">Femoral</option>
                  <option value="Glúteos">Glúteos</option>
                  <option value="Gemelos">Gemelos</option>
                  <option value="Abdominales">Abdominales</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1">Dificultad</label>
                <select
                  value={formData.dificultad}
                  onChange={(e) => setFormData({...formData, dificultad: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
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

              <div>
                <label className="block text-white/60 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">URL de Video</label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/80"
                >
                  {editingExercise ? 'Actualizar' : 'Crear'} Ejercicio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingExercise(null);
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
            {exercises.map((exercise) => (
              <div key={exercise.id_ejercicio} className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/5">
                <div className="flex">
                  <img
                    src={exercise.imagen || `https://via.placeholder.com/200x150?text=${exercise.titulo}`}
                    alt={exercise.titulo}
                    className="w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{exercise.titulo}</h3>
                        <p className="text-white/60 text-sm mt-1">{exercise.grupo_muscular} • {exercise.dificultad}</p>
                        <p className="text-white/40 text-sm mt-2">{exercise.descripcion}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exercise)}
                          className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(exercise.id_ejercicio)}
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

export default AdminExercises;