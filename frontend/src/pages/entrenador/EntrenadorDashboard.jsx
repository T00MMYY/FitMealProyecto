import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EntrenadorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [rutina, setRutina] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState('');
  const [series, setSeries] = useState(3);
  const [repeticiones, setRepeticiones] = useState('10-12');
  const [notas, setNotas] = useState('');

  // Redirigir si no es entrenador
  if (!isAuthenticated || (Number(user?.id_rol) !== 4 && Number(user?.rol) !== 4)) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchClientes();
    fetchEjercicios();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/api/trainers/clients');
      setClientes(response.data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    }
  };

  const fetchEjercicios = async () => {
    try {
      const response = await api.get('/api/exercises');
      setEjercicios(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRutina = async (clienteId) => {
    try {
      const response = await api.get(`/api/trainers/clients/${clienteId}/routine`);
      setRutina(response.data);
    } catch (error) {
      toast.error('Error al cargar la rutina del cliente');
    }
  };

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setIsAssigning(false);
    fetchRutina(cliente.id_usuario);
  };

  const handleAssignExercise = async (e) => {
    e.preventDefault();
    if (!selectedEjercicio) {
      toast.error('Por favor, selecciona un ejercicio');
      return;
    }

    try {
      await api.post('/api/trainers/assign-exercise', {
        id_cliente: selectedCliente.id_usuario,
        id_ejercicio: selectedEjercicio,
        series,
        repeticiones,
        notas
      });
      toast.success('Ejercicio asignado exitosamente');
      setIsAssigning(false);
      setSelectedEjercicio('');
      setNotas('');
      fetchRutina(selectedCliente.id_usuario);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al asignar ejercicio');
    }
  };

  const handleDeleteExercise = async (idRutina) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ejercicio de la rutina?')) return;
    try {
      await api.delete(`/api/trainers/routine/${idRutina}`);
      toast.success('Ejercicio eliminado');
      fetchRutina(selectedCliente.id_usuario);
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase mb-8">Panel de <span className="text-red-600">Entrenador</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna de Clientes */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Mis Clientes
            </h2>
            
            {clientes.length === 0 ? (
              <p className="text-white/40 italic">Aún no tienes clientes asignados.</p>
            ) : (
              <div className="space-y-3">
                {clientes.map(cliente => (
                  <button
                    key={cliente.id_usuario}
                    onClick={() => handleSelectCliente(cliente)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                      selectedCliente?.id_usuario === cliente.id_usuario 
                        ? 'bg-red-600/10 border-red-600/50' 
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-lg">{cliente.nombre} {cliente.apellidos}</div>
                    <div className="text-sm text-white/50">{cliente.email}</div>
                    {(cliente.objetivo || cliente.peso) && (
                      <div className="mt-2 text-xs text-white/40 flex gap-4">
                        {cliente.peso && <span>Peso: {cliente.peso}kg</span>}
                        {cliente.objetivo && <span>Objetivo: {cliente.objetivo}</span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna de Rutina y Asignación */}
          <div className="lg:col-span-2">
            {selectedCliente ? (
              <div className="bg-[#0d0d0d] p-6 lg:p-8 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-3xl font-black italic uppercase">Rutina de {selectedCliente.nombre}</h2>
                    <p className="text-white/40 mt-1">Gestiona los ejercicios asignados a este cliente</p>
                  </div>
                  <button
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-colors"
                  >
                    {isAssigning ? 'Cancelar' : '+ Asignar Ejercicio'}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isAssigning ? (
                    <motion.form 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleAssignExercise} 
                      className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8"
                    >
                      <h3 className="text-xl font-bold mb-4">Nuevo Ejercicio</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-white/40 uppercase mb-2">Ejercicio</label>
                          <select
                            value={selectedEjercicio}
                            onChange={(e) => setSelectedEjercicio(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                            required
                          >
                            <option value="">Selecciona un ejercicio...</option>
                            {ejercicios.map(ej => (
                              <option key={ej.id} value={ej.id}>{ej.titulo} ({ej.musculo_principal})</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-white/40 uppercase mb-2">Series</label>
                          <input
                            type="number"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                            min="1"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-white/40 uppercase mb-2">Repeticiones</label>
                          <input
                            type="text"
                            value={repeticiones}
                            onChange={(e) => setRepeticiones(e.target.value)}
                            placeholder="Ej: 10-12 o Al fallo"
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-white/40 uppercase mb-2">Notas u Observaciones (Opcional)</label>
                          <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Instrucciones específicas para el cliente..."
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 resize-none"
                            rows="2"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-bold transition-colors"
                      >
                        Guardar en Rutina
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {rutina.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                          <p className="text-white/40 italic mb-4">Este cliente aún no tiene ejercicios asignados.</p>
                          <button
                            onClick={() => setIsAssigning(true)}
                            className="text-red-500 hover:text-red-400 font-bold underline"
                          >
                            Asignar el primer ejercicio
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {rutina.map(ej => (
                            <div key={ej.id_rutina} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10">
                                  {ej.imagen ? (
                                    <img src={`http://localhost:3000${ej.imagen}`} alt={ej.titulo} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                      <span className="text-xs text-white/30">Sin img</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg">{ej.titulo}</h4>
                                  <div className="flex gap-3 text-sm text-white/60 mt-1">
                                    <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold">{ej.series} Series</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{ej.repeticiones} Reps</span>
                                    {ej.dificultad && <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{ej.dificultad}</span>}
                                  </div>
                                  {ej.notas && <p className="text-white/40 text-xs mt-2 italic">"{ej.notas}"</p>}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteExercise(ej.id_rutina)}
                                className="text-white/20 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                                title="Eliminar ejercicio"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-[#0d0d0d] rounded-2xl border border-white/5 border-dashed">
                <svg className="w-16 h-16 text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white/60 mb-2">Selecciona un cliente</h3>
                <p className="text-white/40">Haz clic en un cliente de la lista para ver o modificar su rutina</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
