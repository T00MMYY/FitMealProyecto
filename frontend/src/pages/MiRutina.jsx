import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function MiRutina() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedWorkouts, setAssignedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);
  
  // ESTADO INTERACTIVO DE COMPLETADO
  const [completedExercises, setCompletedExercises] = useState({});
  const [serieWeights, setSerieWeights] = useState({});
  const [serieReps, setSerieReps] = useState({});
  const [activeTab, setActiveTab] = useState('General');
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  const SERVER_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get('/api/trainers/my-trainer');
        const isTrainerAssigned = res.data.hasTrainer === true || !!res.data.id_usuario;
        
        if (isTrainerAssigned) {
          setTrainer(res.data.trainer || res.data);
          const id = user?.id_usuario || user?.id;
          const routineRes = await api.get(`/api/trainers/clients/${id}/routine`);
          const workouts = routineRes.data || [];
          setAssignedWorkouts(workouts);

          // Extraer los días disponibles
          const days = [...new Set(workouts.map(w => w.dia_semana || 'General'))];
          setDiasDisponibles(days);
          
          // Setear pestaña activa al día actual si existe en la rutina
          const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const hoy = diasSemana[new Date().getDay()];
          if (days.includes(hoy)) {
            setActiveTab(hoy);
          } else if (days.length > 0) {
            setActiveTab(days[0]);
          }

          // Cargar progreso de hoy
          try {
            const progressRes = await api.get('/api/trainers/today-progress');
            const progressMap = {};
            progressRes.data.forEach(log => {
              progressMap[log.id_rutina] = log.completado === 1 || log.completado === true;
            });
            setCompletedExercises(progressMap);
          } catch (e) {
            console.error("Error cargando progreso:", e);
          }
        } else {
          // SEGURO: La redirección ahora ocurre de forma segura en el flujo de efectos
          navigate('/perfil');
        }
      } catch (err) {
        console.error("Error fetching trainer data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRoutine();
  }, [user, navigate]);

  const toggleExerciseComplete = async (idRutina, e) => {
    e.stopPropagation(); 
    
    const isNowCompleted = !completedExercises[idRutina];
    const weights = serieWeights[idRutina] || [];
    const reps = serieReps[idRutina] || [];
    const pesoIngresado = weights.reduce((sum, value) => {
      const parsed = parseFloat(value);
      return sum + (isNaN(parsed) ? 0 : parsed);
    }, 0);
    const toastMessage = isNowCompleted
      ? '¡Perfecto! Marca todas las series completas y registra peso y repeticiones por serie.'
      : 'Ejercicio marcado como pendiente de nuevo.';

    setCompletedExercises(prev => ({
      ...prev,
      [idRutina]: isNowCompleted
    }));

    toast.success(toastMessage, { id: `toast-${idRutina}` });

    try {
      const series_data = weights.map((peso, index) => ({
        serie: index + 1,
        peso: parseFloat(peso) || 0,
        reps: parseInt(reps[index]) || 0
      }));

      await api.post('/api/trainers/log-workout', {
        id_rutina: idRutina,
        completado: isNowCompleted,
        peso_kg: isNowCompleted ? pesoIngresado : 0,
        series_data
      });
    } catch (error) {
      console.error("Error guardando progreso:", error);
      toast.error("Error al sincronizar con el servidor.");
    }
  };

  const handleCardClick = (idEjercicio, idAlternative) => {
    const targetId = idEjercicio || idAlternative;
    if (targetId) {
      navigate(`/ejercicios/${targetId}`);
    }
  };

  // Filtrar los ejercicios por la pestaña actual
  const currentWorkouts = useMemo(() => {
    return assignedWorkouts.filter(w => (w.dia_semana || 'General') === activeTab);
  }, [assignedWorkouts, activeTab]);

  const totalExercises = currentWorkouts.length;
  
  const totalSeries = useMemo(() => {
    return currentWorkouts.reduce((acc, curr) => acc + (parseInt(curr.series) || 0), 0);
  }, [currentWorkouts]);

  const progressPercentage = useMemo(() => {
    const completedCount = Object.values(completedExercises).filter(Boolean).length;
    return totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
  }, [totalExercises, completedExercises]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-6 font-sans selection:bg-red-600">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Mi Rutina</h1>
            <p className="text-red-500 mt-3 text-xs uppercase tracking-[0.3em] font-black italic">
              Planificación de Alto Rendimiento
            </p>
          </div>
          
          {trainer && (
            <div className="flex items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5 shadow-xl">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-red-600/30 flex-shrink-0">
                {trainer.foto_url ? (
                  <img src={trainer.foto_url.startsWith('http') ? trainer.foto_url : `${SERVER_URL}${trainer.foto_url}`} alt="Entrenador" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-black text-red-600 italic">
                    {trainer.nombre?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[8px] text-red-500 font-black uppercase tracking-widest mb-0.5">Asignado por</p>
                <p className="text-sm font-black italic uppercase tracking-tight">{trainer.nombre} {trainer.apellidos}</p>
              </div>
            </div>
          )}
        </div>

        {assignedWorkouts.length > 0 ? (
          <>
            {/* TABS DE DÍAS DE LA SEMANA */}
            {diasDisponibles.length > 1 && (
              <div className="flex flex-wrap gap-2 bg-[#111] p-2 rounded-2xl border border-white/5 shadow-lg">
                {diasDisponibles.map(dia => (
                  <button
                    key={dia}
                    onClick={() => setActiveTab(dia)}
                    className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === dia 
                        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            )}

            {/* DASHBOARD DE RENDIMIENTO */}
            <div className="bg-[#111] rounded-[2rem] p-6 border border-white/5 flex flex-col gap-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5 text-center md:text-left flex items-center justify-between px-8">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Ejercicios del día</p>
                  <p className="text-4xl font-black italic text-white">{totalExercises}</p>
                </div>
                <div className="bg-black/30 p-5 rounded-xl border border-white/5 text-center md:text-left flex items-center justify-between px-8">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Series Totales Proyectadas</p>
                  <p className="text-4xl font-black italic text-red-600">{totalSeries}</p>
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                  <span>Progreso del Entrenamiento</span>
                  <span className="text-red-500">{progressPercentage}% COMPLETADO</span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* LISTADO DE EJERCICIOS */}
            <div className="grid gap-6">
              {currentWorkouts.length === 0 ? (
                <div className="text-center py-12 text-white/40 italic">No hay ejercicios asignados para el {activeTab}.</div>
              ) : currentWorkouts.map((ex, index) => {
                const isCompleted = !!completedExercises[ex.id_rutina];
                const seriesCount = Math.max(1, parseInt(ex.series) || 1);
                const seriesValues = serieWeights[ex.id_rutina] || Array(seriesCount).fill('');
                const seriesReps = serieReps[ex.id_rutina] || Array(seriesCount).fill('');
                return (
                  <div
                    onClick={() => handleCardClick(ex.id_ejercicio, ex.id)}
                    key={ex.id_rutina}
                    className={`group relative bg-[#111] rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-8 border transition-all duration-500 overflow-hidden shadow-xl cursor-pointer ${
                      isCompleted 
                        ? 'border-green-600/30 opacity-60 hover:opacity-90' 
                        : 'border-white/5 hover:border-red-600/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors"></div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                      <span className="text-5xl font-black italic text-white/5">{String(index + 1).padStart(2, '0')}</span>
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-black/50 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 relative">
                        <img
                          src={ex.imagen?.startsWith('http') ? ex.imagen : `${SERVER_URL}${ex.imagen}`}
                          onError={(e) => { e.target.src = `https://via.placeholder.com/500x300?text=${ex.titulo}` }}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                          alt={ex.titulo}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                      </div>
                    </div>

                    <div className="flex-1 w-full relative z-10">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className={`text-2xl md:text-3xl font-black italic uppercase tracking-tighter transition-colors ${
                              isCompleted ? 'text-green-500/80' : 'group-hover:text-red-500'
                            }`}>
                              {ex.titulo}
                            </h3>
                            <span className="text-[10px] uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                              {ex.dia_semana || 'General'}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-white/30 uppercase mt-1">Dificultad: {ex.dificultad || 'Media'}</p>
                        </div>
                        
                        <button
                          onClick={(e) => toggleExerciseComplete(ex.id_rutina, e)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            isCompleted 
                              ? 'bg-green-600/20 border-green-500 text-green-400' 
                              : 'bg-black/40 border-white/10 text-white/20 hover:border-white/30 hover:text-white'
                          }`}
                          title={isCompleted ? "Marcar como pendiente" : "Marcar como hecho"}
                        >
                          {isCompleted ? '✓' : '◯'}
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-4">
                        <p className="text-sm text-white/60 mb-3">Marca las {ex.series || 1} series como completadas y registra el peso de cada serie.</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {Array.from({ length: seriesCount }, (_, seriesIndex) => (
                            <label key={seriesIndex} className="flex flex-col gap-2">
                              <span className="text-[10px] uppercase tracking-widest text-white/40">Serie {seriesIndex + 1}</span>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={seriesValues[seriesIndex] || ''}
                                onChange={(event) => {
                                  const nextValues = [...seriesValues];
                                  nextValues[seriesIndex] = event.target.value;
                                  setSerieWeights(prev => ({
                                    ...prev,
                                    [ex.id_rutina]: nextValues
                                  }));
                                }}
                                onClick={(event) => event.stopPropagation()}
                                placeholder="Kg"
                                className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600"
                              />
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={(serieReps[ex.id_rutina] || [])[seriesIndex] || ''}
                                onChange={(event) => {
                                  const nextReps = [...(serieReps[ex.id_rutina] || Array(seriesCount).fill(''))];
                                  nextReps[seriesIndex] = event.target.value;
                                  setSerieReps(prev => ({
                                    ...prev,
                                    [ex.id_rutina]: nextReps
                                  }));
                                }}
                                onClick={(event) => event.stopPropagation()}
                                placeholder="Reps"
                                className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-black/30 px-4 py-2.5 rounded-xl border border-white/5">
                          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-0.5">Series</p>
                          <p className="text-xl font-black italic">{ex.series}</p>
                        </div>
                        <div className="bg-black/30 px-4 py-2.5 rounded-xl border border-white/5">
                          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-0.5">Repeticiones</p>
                          <p className="text-xl font-black italic">{ex.repeticiones}</p>
                        </div>
                        <div className="bg-black/30 px-4 py-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-0.5">Músculo</p>
                          <p className="text-sm font-black italic text-red-500 uppercase tracking-tight mt-1">{ex.tipo || 'Fuerza'}</p>
                        </div>
                      </div>

                      {ex.notes || ex.notas ? (
                        <div className="bg-red-900/10 border-l-2 border-red-600 p-4 rounded-r-xl">
                          <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-1">Nota del entrenador</p>
                          <p className="text-sm text-white/70 italic">{ex.notes || ex.notas}</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-500 transition-all hidden md:flex flex-shrink-0">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-24 text-center bg-[#111] rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center">
            <span className="text-6xl mb-6 opacity-20">🏋️</span>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Rutina Vacía</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">Tu entrenador todavía no te ha asignado ningún ejercicio. ¡Aprovecha para descansar o explorar otros entrenamientos!</p>
            <button onClick={() => navigate('/workouts')} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs px-8 py-4 rounded-full tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Explorar Ejercicios Libres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}