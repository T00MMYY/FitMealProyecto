import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', grupo_muscular: '', dificultad: '', descripcion: '', imagen: '', video_url: ''
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get('/api/admin/exercises');
      setExercises(response.data);
    } catch (error) { console.log("Error al cargar ejercicios"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await api.put(`/api/admin/exercises/${editingExercise.id_ejercicio}`, formData);
        toast.success('Ejercicio actualizado correctamente');
      } else {
        await api.post('/api/admin/exercises', formData);
        toast.success('Ejercicio creado correctamente');
      }
      fetchExercises();
      setShowModal(false);
      setEditingExercise(null);
      setFormData({ titulo: '', grupo_muscular: '', dificultad: '', descripcion: '', imagen: '', video_url: '' });
    } catch (error) { 
      toast.error('Error al guardar ejercicio');
      console.log("Error al guardar ejercicio"); 
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
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ejercicio?')) {
      try {
        await api.delete(`/api/admin/exercises/${id}`);
        fetchExercises();
        toast.success('Ejercicio eliminado correctamente');
      } catch (error) { 
        toast.error('Error al eliminar ejercicio');
        console.log("Error al eliminar ejercicio"); 
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic uppercase">Ejercicios</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs"
          >
            + Añadir Nuevo
          </button>
        </div>
        <div className="grid gap-4">
          {exercises.length > 0 ? exercises.map(ex => (
            <div key={ex.id_ejercicio} className="bg-[#0d0d0d] p-4 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold">{ex.titulo}</span>
                <span className="text-white/40 ml-4">{ex.grupo_muscular}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(ex)} className="text-blue-500">Editar</button>
                <button onClick={() => handleDelete(ex.id_ejercicio)} className="text-red-500">Borrar</button>
              </div>
            </div>
          )) : <p className="text-white/20 italic">No hay ejercicios añadidos</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#0d0d0d] p-6 rounded-2xl w-96">
              <h2 className="text-xl font-bold mb-4">{editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h2>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  placeholder="Título" 
                  value={formData.titulo} 
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Grupo Muscular" 
                  value={formData.grupo_muscular} 
                  onChange={(e) => setFormData({...formData, grupo_muscular: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                  required 
                />
                <select 
                  value={formData.dificultad} 
                  onChange={(e) => setFormData({...formData, dificultad: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                  required
                >
                  <option value="">Dificultad</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
                <textarea 
                  placeholder="Descripción" 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="text" 
                  placeholder="URL Imagen" 
                  value={formData.imagen} 
                  onChange={(e) => setFormData({...formData, imagen: e.target.value})} 
                  className="w-full p-2 mb-2 bg-white/10 rounded" 
                />
                <input 
                  type="text" 
                  placeholder="URL Video" 
                  value={formData.video_url} 
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
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

export default AdminExercises;