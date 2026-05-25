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
      setEditingRecipe(null);
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
      titulo: '', musculo_id: '', dificultad: '', descripcion: '', imagen: '', tipo: '', puntos_clave: ''
    });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        
        {/* CABECERA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-black italic uppercase">Ejercicios</h1>
          <button
            onClick={openCreateModal}
            className="bg-red-600 text-white px-6 py-3 sm:py-2 rounded-full font-bold uppercase text-xs w-full sm:w-auto text-center shadow-lg shadow-red-600/10"
          >
            + Añadir Nuevo
          </button>
        </div>

        {/* LISTADO DE EJERCICIOS CORREGIDO */}
        <div className="grid gap-4">
          {exercises.length > 0 ? exercises.map(ex => (
            <div key={ex.id} className="bg-[#0d0d0d] p-5 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-white/5 transition-colors">
              
              {/* Texto principal */}
              <div className="min-w-0 w-full">
                <span className="font-bold text-lg block text-white break-words">{ex.titulo}</span>
              </div>
              
              {/* BOTONES: Ahora en móvil se alinean al inicio (izquierda) o al final en PC de forma fluida */}
              <div className="flex gap-5 border-t border-white/5 pt-3 sm:pt-0 sm:border-none justify-start sm:justify-end w-full sm:w-auto flex-shrink-0">
                <button onClick={() => handleEdit(ex)} className="text-blue-400 hover:text-blue-300 transition-colors uppercase text-xs font-bold tracking-wider py-1">Editar</button>
                <button onClick={() => handleDelete(ex.id)} className="text-red-500 hover:text-red-400 transition-colors uppercase text-xs font-bold tracking-wider py-1">Borrar</button>
              </div>

            </div>
          )) : <p className="text-white/20 italic">No hay ejercicios añadidos</p>}
        </div>

        {/* MODAL RESPONSIVE */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-[#121212] border border-white/10 p-5 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar mx-2">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-red-600 rounded-b-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

              <h2 className="text-2xl font-black italic text-white mb-6 uppercase tracking-wider">
                {editingExercise ? 'Editar' : 'Crear'} <span className="text-red-600">Ejercicio</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Información General</label>
                  <input
                    type="text"
                    placeholder="Nombre del ejercicio"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">ID Músculo</label>
                    <input
                      type="text"
                      placeholder="Ej: 3"
                      value={formData.musculo_id}
                      onChange={(e) => setFormData({ ...formData, musculo_id: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm md:text-base"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Dificultad</label>
                    <select
                      value={formData.dificultad}
                      onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm md:text-base cursor-pointer"
                      required
                    >
                      <option value="" className="text-gray-500">Seleccionar</option>
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Descripción</label>
                  <textarea
                    placeholder="Descripción técnica..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-24 resize-none focus:outline-none focus:border-red-600 text-sm md:text-base"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Multimedia</label>
                    <input
                      type="text"
                      placeholder="URL de la imagen o GIF"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Técnica</label>
                    <textarea
                      placeholder="Puntos clave (separar con | )"
                      value={formData.puntos_clave}
                      onChange={(e) => setFormData({ ...formData, puntos_clave: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-16 resize-none focus:outline-none focus:border-red-600 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 border border-white/5 text-xs md:text-sm"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl shadow-lg shadow-red-600/20 text-xs md:text-sm"
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