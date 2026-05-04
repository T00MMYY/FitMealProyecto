import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', musculo_id: '', dificultad: '', descripcion: '', imagen: '', tipo: '', puntos_clave: ''
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
        await api.put(`/api/admin/exercises/${editingExercise.id}`, formData);
        toast.success('Ejercicio actualizado correctamente');
      } else {
        await api.post('/api/admin/exercises', formData);
        toast.success('Ejercicio creado correctamente');
      }
      fetchExercises();
      setShowModal(false);
      setEditingExercise(null);
      setFormData({ titulo: '', musculo_id: '', dificultad: '', descripcion: '', imagen: '', tipo: '', puntos_clave: '' });
    } catch (error) {
      toast.error('Error al guardar ejercicio');
      console.log("Error al guardar ejercicio");
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      titulo: exercise.titulo || '',
      musculo_id: exercise.musculo_id || '',
      dificultad: exercise.dificultad || '',
      descripcion: exercise.descripcion || '',
      imagen: exercise.imagen || '',
      tipo: exercise.tipo || '',
      puntos_clave: exercise.puntos_clave || ''
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

  const openCreateModal = () => {
    setEditingExercise(null);
    setFormData({
      titulo: '',
      musculo_id: '',
      dificultad: '',
      descripcion: '',
      imagen: '',
      tipo: '',
      puntos_clave: ''
    });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic uppercase">Ejercicios</h1>
          <button
            onClick={openCreateModal}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs"
          >
            + Añadir Nuevo
          </button>
        </div>
        <div className="grid gap-4">
          {exercises.length > 0 ? exercises.map(ex => (
            <div key={ex.id} className="bg-[#0d0d0d] p-4 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold">{ex.titulo}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(ex)} className="text-blue-500">Editar</button>
                <button onClick={() => handleDelete(ex.id)} className="text-red-500">Borrar</button>
              </div>
            </div>
          )) : <p className="text-white/20 italic">No hay ejercicios añadidos</p>}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay con blur para mayor enfoque */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setShowModal(false)}
            />

            {/* Contenedor del Modal */}
            <div className="relative bg-[#121212] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl transform transition-all">

              {/* Indicador visual superior (estilo deportivo) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-red-600 rounded-b-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

              <h2 className="text-2xl font-black italic text-white mb-6 uppercase tracking-wider">
                {editingExercise ? 'Editar' : 'Crear'} <span className="text-red-600">Ejercicio</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Información General</label>
                  <input
                    type="text"
                    placeholder="Nombre del ejercicio"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="ID Músculo"
                    value={formData.musculo_id}
                    onChange={(e) => setFormData({ ...formData, musculo_id: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all"
                    required
                  />
                  <select
                    value={formData.dificultad}
                    onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all"
                    required
                  >
                    <option value="" className="text-gray-500">Dificultad</option>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>

                <textarea
                  placeholder="Descripción técnica..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-24 resize-none focus:outline-none focus:border-red-600 transition-all"
                />

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="URL de la imagen o GIF"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 transition-all"
                  />
                  <textarea
                    placeholder="Puntos clave (separar con | )"
                    value={formData.puntos_clave}
                    onChange={(e) => setFormData({ ...formData, puntos_clave: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-16 focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
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

export default AdminExercises;