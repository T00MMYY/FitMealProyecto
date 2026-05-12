import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function Ejercicios() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Favoritos y Progreso
  const [isFavorite, setIsFavorite] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [peso, setPeso] = useState("");
  const [repeticiones, setRepeticiones] = useState("");
  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Cargar datos del ejercicio
    api.get(`/api/exercises/detail/${id}`)
      .then(res => {
        setExercise(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Cargar si es favorito
    api.get('/api/favorites-exercises')
      .then(res => {
        setIsFavorite(res.data.some(fav => fav.id === parseInt(id)));
      })
      .catch(err => console.error("Error cargando favoritos:", err));

    // Cargar historial de progreso
    fetchProgress();
  }, [id]);

  const fetchProgress = () => {
    api.get(`/api/progress-exercises/${id}`)
      .then(res => setProgressHistory(res.data))
      .catch(err => console.error("Error cargando progreso:", err));
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites-exercises/${id}`);
        setIsFavorite(false);
        toast.success("Ejercicio eliminado de favoritos");
      } else {
        await api.post('/api/favorites-exercises', { id_ejercicio: id });
        setIsFavorite(true);
        toast.success("Ejercicio añadido a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!peso) {
      toast.error("Debes ingresar el peso");
      return;
    }
    
    setIsSubmittingProgress(true);
    try {
      await api.post('/api/progress-exercises', {
        id_ejercicio: id,
        peso: peso,
        repeticiones: repeticiones || null
      });
      toast.success("Progreso registrado");
      setPeso("");
      setRepeticiones("");
      fetchProgress(); // Recargar historial
    } catch (error) {
      toast.error("Error al registrar progreso");
    } finally {
      setIsSubmittingProgress(false);
    }
  };

  const handleDeleteProgress = async (id_progreso) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await api.delete(`/api/progress-exercises/${id_progreso}`);
      toast.success("Registro eliminado");
      fetchProgress();
    } catch (error) {
      toast.error("Error al eliminar registro");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <p className="text-primary font-black animate-pulse uppercase tracking-widest text-2xl">CARGANDO...</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black italic mb-4 uppercase">Ejercicio no encontrado</h1>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline font-black uppercase">Volver atrás</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black">
      {/* Botón Flotante para Volver */}
      <div className="fixed top-24 left-10 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full hover:bg-primary hover:text-black transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto pt-40 pb-20 px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: VISUAL */}
          <div className="sticky top-40 space-y-6">
            <div className="rounded-[40px] overflow-hidden border border-white/10 bg-[#121212] aspect-video relative group">
              {exercise.video ? (
                <video 
                  src={exercise.video}
                  controls
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                />
              ) : (
                <>
                  <img 
                    src={exercise.imagen || 'https://via.placeholder.com/800x600/121212/ffffff?text=Sin+Imagen'} 
                    alt={exercise.titulo} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none"></div>
                </>
              )}
              
              {/* Botón de Favorito */}
              <button
                onClick={handleToggleFavorite}
                className="absolute top-6 right-6 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:scale-110 transition-transform"
              >
                <svg 
                  className={`w-8 h-8 transition-colors ${isFavorite ? "text-primary fill-primary" : "text-white fill-none"}`} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-white/5 border border-white/5 p-6 rounded-3xl">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Dificultad</p>
                <p className="text-xl font-black italic uppercase text-primary">{exercise.dificultad}</p>
              </div>
              <div className="flex-1 bg-white/5 border border-white/5 p-6 rounded-3xl">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Tipo</p>
                <p className="text-xl font-black italic uppercase tracking-tighter">{exercise.tipo || "Fuerza / Hipertrofia"}</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN Y PROGRESO */}
          <div className="space-y-12">
            <section>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6">
                {exercise.titulo}
              </h1>
              <div className="h-1.5 w-40 bg-primary shadow-[0_0_30px_rgba(211,15,21,0.4)]"></div>
            </section>

            {/* Progreso del Ejercicio */}
            <section className="bg-white/5 border border-white/10 rounded-[30px] p-8">
              <h3 className="text-primary font-black uppercase text-xl tracking-[0.1em] mb-6 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Tu Progreso
              </h3>
              
              <form onSubmit={handleAddProgress} className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold uppercase text-white/50 mb-2">Peso (kg/lbs)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={peso} 
                    onChange={e => setPeso(e.target.value)} 
                    placeholder="Ej. 60" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold uppercase text-white/50 mb-2">Repeticiones</label>
                  <input 
                    type="number" 
                    value={repeticiones} 
                    onChange={e => setRepeticiones(e.target.value)} 
                    placeholder="Ej. 10" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="w-full sm:w-auto flex items-end">
                  <button 
                    type="submit" 
                    disabled={isSubmittingProgress}
                    className="w-full sm:w-auto bg-primary text-black font-black uppercase px-8 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                  >
                    Guardar
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {progressHistory.length > 0 ? (
                  progressHistory.map(record => (
                    <div key={record.id_progreso} className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <span className="block text-2xl font-black italic text-primary">{record.peso}</span>
                          <span className="text-[9px] uppercase text-white/40 font-bold">KG</span>
                        </div>
                        {record.repeticiones && (
                          <div className="text-center border-l border-white/10 pl-6">
                            <span className="block text-xl font-black italic text-white">{record.repeticiones}</span>
                            <span className="text-[9px] uppercase text-white/40 font-bold">Reps</span>
                          </div>
                        )}
                        <div className="text-center border-l border-white/10 pl-6 hidden sm:block">
                          <span className="block text-sm font-medium text-white/80">{new Date(record.fecha).toLocaleDateString()}</span>
                          <span className="text-[9px] uppercase text-white/40 font-bold">Fecha</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteProgress(record.id_progreso)}
                        className="text-white/20 hover:text-red-500 transition-colors p-2"
                        title="Eliminar registro"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-white/30 text-center py-6 italic text-sm">Aún no has registrado ningún peso en este ejercicio.</p>
                )}
              </div>
            </section>

            <section className="space-y-8">
              <div>
                <h3 className="text-primary font-black uppercase text-xs tracking-[0.3em] mb-4">Descripción Técnica</h3>
                <p className="text-white/50 text-xl leading-relaxed font-medium italic">
                  {exercise.descripcion || "Realiza el movimiento de forma controlada, manteniendo la tensión muscular durante todo el rango de movimiento. Enfócate en la conexión mente-músculo."}
                </p>
              </div>

              <div className="grid gap-4">
                <h3 className="text-primary font-black uppercase text-xs tracking-[0.3em] mb-2">Puntos Clave</h3>
                {(exercise.puntos_clave ? exercise.puntos_clave.split('|') : [
                  "Controlar la fase excéntrica (bajada).",
                  "Mantener el core estable en todo momento.",
                  "Evitar el uso de inercias o balanceos."
                ]).map((tip, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-primary font-black italic">0{i+1}</span>
                    <p className="text-sm font-bold uppercase tracking-wide">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}