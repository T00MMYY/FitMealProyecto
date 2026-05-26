import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MUSCLE_DISPLAY_NAMES = {
  CHEST: 'Pecho',
  BICEPS: 'Bíceps',
  TRICEPS: 'Tríceps',
  ESPALDA: 'Espalda',
  HOMBROS: 'Hombros',
  ABDOMEN: 'Abdominales',
  ANTEBRAZO: 'Antebrazos',
  CUADRICEPS: 'Cuádriceps',
  FEMORAL: 'Femoral',
  GLUTEOS: 'Glúteos',
  GEMELOS: 'Gemelos',
  ABDUCTORES: 'Abductores',
  ADUCTORES: 'Aductores',
  CUELLO: 'Cuello',
  CORE: 'Core',
};

const formatMuscleName = (value) => {
  if (!value) return '';
  const key = String(value).trim().toUpperCase().replace(/\s+/g, '_');
  if (MUSCLE_DISPLAY_NAMES[key]) {
    return MUSCLE_DISPLAY_NAMES[key];
  }
  return String(value)
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function MiRutina() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedWorkouts, setAssignedWorkouts] = useState([]);
  const [myRoutines, setMyRoutines] = useState([]);
  const [selectedMyRoutine, setSelectedMyRoutine] = useState(null);
  const [viewMode, setViewMode] = useState('assigned'); // 'my' or 'assigned'
  const [allExercises, setAllExercises] = useState([]);
  const [visibleExercises, setVisibleExercises] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [musclesLoading, setMusclesLoading] = useState(true);
  const [muscleLoadError, setMuscleLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);
  const [showCreateRoutineForm, setShowCreateRoutineForm] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [showAddExercisePanel, setShowAddExercisePanel] = useState(false);
  const [selectedMuscleId, setSelectedMuscleId] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [routineError, setRoutineError] = useState(null);
  
  // ESTADO INTERACTIVO DE COMPLETADO
  const [completedExercises, setCompletedExercises] = useState({});
  const [serieWeights, setSerieWeights] = useState({});
  const [serieReps, setSerieReps] = useState({});
  const [activeTab, setActiveTab] = useState('General');
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  const SERVER_URL = 'http://localhost:3000';

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x240/111111/ffffff?text=Sin+imagen';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${SERVER_URL}${imagePath}`;
    }
    return `${SERVER_URL}/${imagePath}`;
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get('/api/trainers/my-trainer');
        const isTrainerAssigned = res.data.hasTrainer === true || !!res.data.id_usuario;
        
        if (isTrainerAssigned) {
          setTrainer(res.data.trainer || res.data);
          const id = user?.id_usuario || user?.id;
          let workouts = [];
          try {
            const routineRes = await api.get(`/api/trainers/clients/${id}/routine`);
            workouts = routineRes.data || [];
            setAssignedWorkouts(workouts);
            setRoutineError(null);
          } catch (err) {
            console.error('Error al cargar la rutina asignada', err);
            workouts = [];
            setAssignedWorkouts([]);
            setRoutineError('No se pudo cargar la rutina asignada. Aún puedes ver tus rutinas personales.');
          }

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
          setTrainer(null);
          setAssignedWorkouts([]);
          setRoutineError('Aún no tienes una rutina asignada.');
        }

        // Cargar mis rutinas
        try {
          const myRes = await api.get('/api/routines');
          setMyRoutines(myRes.data || []);
          if ((myRes.data || []).length > 0) {
            setSelectedMyRoutine(myRes.data[0]);
          }
        } catch (e) {
          console.error('Error cargando mis rutinas', e);
        }
        // Cargar ejercicios para añadir a rutinas
        try {
          const exRes = await api.get('/api/exercises');
          const exercises = exRes.data || [];
          setAllExercises(exercises);
          setVisibleExercises(exercises);
        } catch (e) {
          console.error('Error cargando ejercicios', e);
        }

        // Cargar lista de músculos desde la base de datos
        try {
          setMusclesLoading(true);
          setMuscleLoadError(null);
          const muscleRes = await api.get('/api/exercises/muscles');
          setMuscles((muscleRes.data || []).map(muscle => ({
            ...muscle,
            name: formatMuscleName(muscle.nombre_key)
          })));
        } catch (e) {
          console.error('Error cargando músculos', e);
          setMuscles([]);
          setMuscleLoadError('No se pudieron cargar las partes del cuerpo');
        } finally {
          setMusclesLoading(false);
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

  const createRoutine = async () => {
    if (!newRoutineName.trim()) {
      toast.error('Escribe un nombre para tu nueva rutina.');
      return;
    }

    try {
      const res = await api.post('/api/routines', { nombre: newRoutineName.trim() });
      const createdRoutine = { ...res.data, ejercicios: [] };
      setMyRoutines(prev => [createdRoutine, ...prev]);
      setSelectedMyRoutine(createdRoutine);
      setViewMode('my');
      setShowCreateRoutineForm(false);
      setNewRoutineName('');
      toast.success('Rutina creada');
    } catch (e) {
      console.error('Error creando rutina', e);
      toast.error('No se pudo crear la rutina');
    }
  };

  const addExerciseToSelectedRoutine = async (id_ejercicio) => {
    if (!selectedMyRoutine) {
      toast.error('Selecciona una rutina');
      return;
    }
    if (!id_ejercicio) {
      toast.error('Selecciona un ejercicio para añadir.');
      return;
    }

    try {
      await api.post(`/api/routines/${selectedMyRoutine.id}/exercises`, { id_ejercicio });
      const myRes = await api.get('/api/routines');
      setMyRoutines(myRes.data || []);
      setSelectedMyRoutine(myRes.data.find(r => r.id === selectedMyRoutine.id));
      setShowAddExercisePanel(false);
      setExerciseQuery('');
      setSelectedExerciseId(null);
      toast.success('Ejercicio añadido a la rutina');
    } catch (e) {
      console.error('Error añadiendo ejercicio', e);
      toast.error('Error al añadir ejercicio');
    }
  };

  const addSelectedExercise = () => {
    addExerciseToSelectedRoutine(selectedExerciseId);
  };

  // Filtrar los ejercicios por la pestaña actual
  const currentWorkouts = useMemo(() => {
    return assignedWorkouts.filter(w => (w.dia_semana || 'General') === activeTab);
  }, [assignedWorkouts, activeTab]);

  const filteredExercises = useMemo(() => {
    const query = exerciseQuery.trim().toLowerCase();
    return visibleExercises.filter(ex => {
      if (!query) return true;
      const muscleName = muscles.find(m => String(m.id) === String(ex.musculo_id))?.name || '';
      return [ex.titulo, ex.tipo, ex.descripcion, muscleName]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query));
    });
  }, [visibleExercises, exerciseQuery, muscles]);

  useEffect(() => {
    if (filteredExercises.length > 0) {
      setSelectedExerciseId(filteredExercises[0].id);
    } else {
      setSelectedExerciseId(null);
    }
  }, [filteredExercises]);

  useEffect(() => {
    if (selectedMuscleId === null) {
      setVisibleExercises(allExercises);
      return;
    }

    const fetchMuscleExercises = async () => {
      try {
        const res = await api.get(`/api/exercises/muscles/${selectedMuscleId}`);
        setVisibleExercises(res.data || []);
      } catch (e) {
        console.error('Error cargando ejercicios por músculo', e);
        setVisibleExercises([]);
      }
    };

    fetchMuscleExercises();
  }, [selectedMuscleId, allExercises]);

  const totalExercises = currentWorkouts.length;
  
  useEffect(() => {
    if (viewMode === 'my' && myRoutines.length > 0) {
      const exists = selectedMyRoutine && myRoutines.some(r => r.id === selectedMyRoutine.id);
      if (!exists) {
        setSelectedMyRoutine(myRoutines[0]);
      }
    }
  }, [viewMode, myRoutines, selectedMyRoutine]);

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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-red-600/30 shrink-0">
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

        <div className="flex flex-wrap gap-4 items-center">
          <button onClick={() => setViewMode('assigned')} className={`px-4 py-2 rounded-xl font-black ${viewMode === 'assigned' ? 'bg-red-600' : 'bg-white/5'}`}>Rutina Asignada</button>
          <button onClick={() => setViewMode('my')} className={`px-4 py-2 rounded-xl font-black ${viewMode === 'my' ? 'bg-red-600' : 'bg-white/5'}`}>Mi Rutina</button>
          {viewMode === 'my' && (
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setShowCreateRoutineForm(prev => !prev);
                  setShowAddExercisePanel(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-black ${showCreateRoutineForm ? 'bg-green-500' : 'bg-green-600 hover:bg-green-500'}`}
              >
                Crear Rutina
              </button>
              <button
                onClick={() => {
                  setShowAddExercisePanel(prev => !prev);
                  setShowCreateRoutineForm(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-black ${showAddExercisePanel ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                Añadir Ejercicio
              </button>
            </div>
          )}
        </div>

        {viewMode === 'assigned' && assignedWorkouts.length > 0 ? (
          <>
            {/* TABS DE DÍAS DE LA SEMANA */}
            {diasDisponibles.length > 1 && (
              <div className="flex flex-wrap gap-2 bg-[#111] p-2 rounded-2xl border border-white/5 shadow-lg">
                {diasDisponibles.map(dia => (
                  <button
                    key={dia}
                    onClick={() => setActiveTab(dia)}
                    className={`flex-1 min-w-25 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
            <div className="bg-[#111] rounded-4xl p-6 border border-white/5 flex flex-col gap-6 shadow-xl">
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
                    className={`group relative bg-[#111] rounded-4xl p-6 flex flex-col md:flex-row items-center gap-8 border transition-all duration-500 overflow-hidden shadow-xl cursor-pointer ${
                      isCompleted 
                        ? 'border-green-600/30 opacity-60 hover:opacity-90' 
                        : 'border-white/5 hover:border-red-600/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors"></div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                      <span className="text-5xl font-black italic text-white/5">{String(index + 1).padStart(2, '0')}</span>
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-black/50 rounded-2xl overflow-hidden border border-white/10 shrink-0 relative">
                        <img
                          src={ex.imagen?.startsWith('http') ? ex.imagen : `${SERVER_URL}${ex.imagen}`}
                          onError={(e) => { e.target.src = `https://via.placeholder.com/500x300?text=${ex.titulo}` }}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                          alt={ex.titulo}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#111] via-transparent to-transparent opacity-80" />
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

                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hidden md:flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-500 transition-all shrink-0">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : viewMode === 'my' ? (
          <>
            {showCreateRoutineForm && (
              <div className="bg-[#111] rounded-4xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Nueva Rutina</h2>
                    <p className="text-sm text-white/40">Crea una rutina personal sin salir de esta pantalla.</p>
                  </div>
                  <button
                    onClick={() => setShowCreateRoutineForm(false)}
                    className="text-white/40 hover:text-white text-sm font-black uppercase"
                  >Cerrar</button>
                </div>
                <input
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="Nombre de la rutina"
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-red-600 outline-none"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={createRoutine}
                    className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest"
                  >Crear rutina</button>
                  <button
                    onClick={() => setShowCreateRoutineForm(false)}
                    className="bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest"
                  >Cancelar</button>
                </div>
              </div>
            )}

            {showAddExercisePanel && (
              <div className="bg-[#111] rounded-4xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Añadir Ejercicio</h2>
                    <p className="text-sm text-white/40">Elige una parte del cuerpo y luego selecciona el ejercicio con la imagen.</p>
                  </div>
                  <button
                    onClick={() => setShowAddExercisePanel(false)}
                    className="text-white/40 hover:text-white text-sm font-black uppercase"
                  >Cerrar</button>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">Parte del cuerpo</label>
                  <select
                    value={selectedMuscleId || ''}
                    onChange={(e) => setSelectedMuscleId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white"
                  >
                    <option value="">Todas las partes</option>
                    {musclesLoading ? (
                      <option disabled>Cargando partes...</option>
                    ) : muscleLoadError ? (
                      <option disabled>{muscleLoadError}</option>
                    ) : (
                      muscles.map((muscle) => (
                        <option key={muscle.id} value={muscle.id}>{muscle.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">Ejercicio</label>
                  <select
                    value={selectedExerciseId || ''}
                    onChange={(e) => setSelectedExerciseId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white"
                  >
                    {filteredExercises.length === 0 ? (
                      <option value="">No hay ejercicios disponibles</option>
                    ) : (
                      filteredExercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>{ex.titulo} {ex.tipo ? `(${ex.tipo})` : ''}</option>
                      ))
                    )}
                  </select>
                </div>

                <button
                  onClick={addSelectedExercise}
                  disabled={!selectedExerciseId}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest"
                >
                  Añadir ejercicio seleccionado
                </button>

                <input
                  value={exerciseQuery}
                  onChange={(e) => setExerciseQuery(e.target.value)}
                  placeholder="Buscar ejercicio por nombre o tipo"
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-red-600 outline-none"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredExercises.slice(0, 8).map(ex => (
                    <div key={ex.id} className="bg-black/40 border border-white/10 rounded-3xl p-4 flex flex-col gap-4 overflow-hidden">
                      <div className="relative h-36 overflow-hidden rounded-3xl bg-black/30 border border-white/10">
                        <img
                          src={getImageUrl(ex.imagen)}
                          alt={ex.titulo}
                          className="h-full w-full object-cover transition duration-700 hover:scale-105"
                          onError={(event) => { event.target.src = 'https://via.placeholder.com/350x210?text=Ejercicio'; }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-black text-lg leading-tight">{ex.titulo}</h3>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">{muscles.find(m => String(m.id) === String(ex.musculo_id))?.name || 'General'}</span>
                        </div>
                        <p className="text-white/40 text-sm line-clamp-3">{ex.descripcion || 'Ejercicio recomendado para el músculo seleccionado.'}</p>
                      </div>
                      <button
                        onClick={() => addExerciseToSelectedRoutine(ex.id)}
                        className="mt-2 w-full bg-red-600 hover:bg-red-500 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest"
                      >Añadir</button>
                    </div>
                  ))}
                  {filteredExercises.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 p-6 text-center text-white/40">
                      No se encontró ningún ejercicio. Cambia de parte del cuerpo o prueba otra búsqueda.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#111] rounded-4xl p-6 border border-white/5 flex flex-col gap-6 shadow-xl">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-xs text-white/40">Selecciona rutina</label>
                  <select value={selectedMyRoutine?.id || ''} onChange={(e) => setSelectedMyRoutine(myRoutines.find(r => r.id === Number(e.target.value)) || null)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white">
                    {myRoutines.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                </div>
                <div className="w-48 text-right">
                  <div className="text-[10px] text-white/30 uppercase font-black">Ejercicios</div>
                  <div className="text-xl font-black">{selectedMyRoutine?.ejercicios?.length || 0}</div>
                </div>
              </div>

              <div className="grid gap-6">
                {selectedMyRoutine && selectedMyRoutine.ejercicios && selectedMyRoutine.ejercicios.length > 0 ? (
                  selectedMyRoutine.ejercicios.map((ex) => (
                    <div key={ex.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-black/50 rounded-lg overflow-hidden">
                          <img src={getImageUrl(ex.imagen)} alt={ex.titulo} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-black text-lg">{ex.titulo}</div>
                          <div className="text-white/40 text-sm">Series: {ex.series} • Reps: {ex.repeticiones}</div>
                        </div>
                      </div>
                      <div>
                        <button onClick={() => handleCardClick(ex.id_ejercicio || ex.id)} className="bg-red-600 px-4 py-2 rounded-full font-black">Ver</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/40 italic">Aún no has añadido ejercicios a esta rutina.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-24 text-center bg-[#111] rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center">
            <span className="text-6xl mb-6 opacity-20">🏋️</span>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Rutina Vacía</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              {routineError || 'Tu entrenador todavía no te ha asignado ningún ejercicio. ¡Aprovecha para descansar o explorar otros entrenamientos!'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button onClick={() => navigate('/workouts')} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs px-8 py-4 rounded-full tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                Explorar Ejercicios Libres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}