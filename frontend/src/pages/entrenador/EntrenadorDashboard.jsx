import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const formatObjective = (texto = '') => {
  return texto
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

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
  const [diaSemana, setDiaSemana] = useState('General');

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
    
    // Scroll responsive automático al panel de rutina en móviles al pulsar un cliente
    if (window.innerWidth < 1024) {
      document.getElementById('routine-panel')?.scrollIntoView({ behavior: 'smooth' });
    }
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
        notas,
        dia_semana: diaSemana
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
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ENCABEZADO PRINCIPAL RESPONSIVE */}
        <div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight">
            Panel de <span className="text-red-600">Entrenador</span>
          </h1>
        </div>

        {/* DISTRIBUCIÓN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUMNA DE CLIENTES */}
          <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
              <svg className="w-5 h-5 md:w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Mis Clientes
            </h2>
            
            {clientes.length === 0 ? (
              <p className="text-white/40 text-sm italic py-4">Aún no tienes clientes asignados.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] lg:max-h-[600px] overflow-y-auto pr-1">
                {clientes.map(cliente => (
                  <button
                    key={cliente.id_usuario}
                    onClick={() => handleSelectCliente(cliente)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                      selectedCliente?.id_usuario === cliente.id_usuario 
                        ? 'bg-red-600/10 border-red-600/30' 
                        : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-base md:text-lg text-white truncate">{cliente.nombre} {cliente.apellidos}</div>
                    <div className="text-xs md:text-sm text-white/50 truncate mt-0.5">{cliente.email}</div>
                    {(cliente.objective || cliente.objetivo || cliente.peso) && (
                      <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-white/40 flex flex-wrap gap-x-4 gap-y-1">
                        {cliente.peso && <span>Peso: <strong className="text-white font-mono">{cliente.peso}kg</strong></span>}
                        {(cliente.objetivo || cliente.objective) && <span>Meta: <strong className="text-white capitalize">{formatObjective(cliente.objetivo || cliente.objective)}</strong></span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DE RUTINA Y ASIGNACIÓN (Se mapea con id para scroll móvil) */}
          <div id="routine-panel" className="lg:col-span-2">
            {selectedCliente ? (
              <div className="bg-[#0d0d0d] p-5 md:p-8 rounded-2xl border border-white/5 shadow-xl">
                
                {/* Cabecera interna adaptable */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-white/5 pb-4">
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-3xl font-black italic uppercase text-white truncate">Rutina de {selectedCliente.nombre}</h2>
                    <p className="text-white/40 text-xs md:text-sm mt-0.5">Gestiona los ejercicios asignados a este cliente</p>
                  </div>
                  <button
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider w-full sm:w-auto text-center"
                  >
                    {isAssigning ? 'Cancelar' : '+ Asignar Ejercicio'}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isAssigning ? (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleAssignExercise} 
                      className="bg-white/[0.02] p-4 md:p-6 rounded-xl border border-white/5 mb-6 space-y-4"
                    >
                      <h3 className="text-lg font-bold text-white">Nuevo Ejercicio</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* SELECT CORREGIDO PARA APERTURAS () */}
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label className="block text-[10px] font-bold text-white/40 uppercase ml-1">Ejercicio</label>
                          <select
                            value={selectedEjercicio}
                            onChange={(e) => setSelectedEjercicio(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 cursor-pointer"
                            required
                          >
                            <option value="">Selecciona un ejercicio...</option>
                            {ejercicios.map(ej => (
                              <option key={ej.id} value={ej.id}>
                                {/* Renderizado condicional: Solo añade el paréntesis si el músculo tiene texto real */}
                                {ej.titulo}{ej.musculo_principal ? ` (${ej.musculo_principal})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <label className="block text-[10px] font-bold text-white/40 uppercase ml-1">Día de la semana</label>
                          <select
                            value={diaSemana}
                            onChange={(e) => setDiaSemana(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 cursor-pointer"
                          >
                            <option value="General">General (Sin día)</option>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                          </select>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <label className="block text-[10px] font-bold text-white/40 uppercase ml-1">Series</label>
                          <input
                            type="number"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 font-mono"
                            min="1"
                            required
                          />
                        </div>
                        
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-white/40 uppercase ml-1">Repeticiones</label>
                          <input
                            type="text"
                            value={repeticiones}
                            onChange={(e) => setRepeticiones(e.target.value)}
                            placeholder="Ej: 10-12 o Al fallo"
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label className="block text-[10px] font-bold text-white/40 uppercase ml-1">Notas u Observaciones (Opcional)</label>
                          <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Instrucciones específicas para el cliente..."
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 resize-none text-sm"
                            rows="2"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold text-sm transition-colors active:scale-[0.99]"
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
                        <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/10 border-dashed p-4">
                          <p className="text-white/40 text-sm italic mb-3">Este cliente aún no tiene ejercicios asignados.</p>
                          <button
                            onClick={() => setIsAssigning(true)}
                            className="text-red-500 hover:text-red-400 font-bold text-sm underline"
                          >
                            Asignar el primer ejercicio
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rutina.map(ej => (
                            /* Fila de Rutina Ajustada para Responsive */
                            <div key={ej.id_rutina} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/5 hover:border-white/10 transition-all">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-14 h-14 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10">
                                  {ej.imagen ? (
                                    <img
                                      src={ej.imagen}
                                      alt={ej.titulo}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                      <span className="text-[10px] text-white/20">Sin img</span>
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-base md:text-lg text-white truncate">{ej.titulo}</h4>
                                  <div className="flex flex-wrap gap-2 text-sm text-white/60 mt-1">
                                    <span className="bg-red-600/10 text-red-400 border border-red-600/10 px-2 py-0.5 rounded text-[11px] font-bold font-mono">{ej.series} Series</span>
                                    <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[11px] font-mono">{ej.repeticiones} Reps</span>
                                    {ej.dia_semana && ej.dia_semana !== 'General' && (
                                      <span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-600/10">{ej.dia_semana}</span>
                                    )}
                                  </div>
                                  {ej.notas && <p className="text-white/40 text-xs mt-2 italic break-words">"{ej.notas}"</p>}
                                </div>
                              </div>
                              
                              {/* Botón Borrar: Visible siempre en móviles, hover en PC */}
                              <div className="flex justify-end border-t border-white/5 pt-2 sm:pt-0 sm:border-none">
                                <button
                                  onClick={() => handleDeleteExercise(ej.id_rutina)}
                                  className="text-white/40 hover:text-red-500 p-2 sm:opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-xs uppercase font-bold tracking-wider sm:normal-case sm:font-normal"
                                  title="Eliminar ejercicio"
                                >
                                  <span className="sm:hidden">Eliminar</span>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center bg-[#0d0d0d] rounded-2xl border border-white/5 border-dashed p-4">
                <svg className="w-12 h-12 md:w-16 h-16 text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg md:text-xl font-bold text-white/60 mb-1">Selecciona un cliente</h3>
                <p className="text-white/40 text-xs md:text-sm max-w-xs">Haz clic en un cliente de la lista para ver o modificar su rutina</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}