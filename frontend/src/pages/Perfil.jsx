import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { calculateMacros } from '../utils/macrosCalculator';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const [userData, setUserData] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [assignedExercises, setAssignedExercises] = useState([]);

  // URL base para prefigurar recursos estáticos locales como imágenes
  const SERVER_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = user?.id_usuario || user?.id;
        if (!id) return;
        
        const response = await api.get(`/api/users/${id}`);
        setUserData(response.data.user || response.data);

        try {
          const trainerRes = await api.get('/api/trainers/my-trainer');
          
          // Soporte dual para formato nuevo y antiguo del backend
          const isTrainerAssigned = trainerRes.data.hasTrainer === true || !!trainerRes.data.id_usuario;
          
          if (isTrainerAssigned) {
            setTrainer(trainerRes.data.trainer || trainerRes.data);
            
            // Cargar ejercicios asignados por el entrenador usando la ID limpia
            try {
              const exercisesRes = await api.get(`/api/trainers/clients/${id}/routine`);
              setAssignedExercises(exercisesRes.data || []);
            } catch (err) {
              console.error("Error al cargar la rutina del entrenador", err);
            }
          } else {
            setTrainer(null);
          }
        } catch (err) {
          // Captura errores reales de caída de servidor
          console.error("Error al conectar con la sección de entrenadores", err);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const displayUser = userData || user;
  const macros = calculateMacros(displayUser);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      setUploading(true);
      const id = user?.id_usuario || user?.id;
      const response = await api.post(`/api/users/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUserData(prev => ({ ...prev, foto_url: response.data.foto_url }));
      toast.success("Foto actualizada correctamente");
    } catch (error) {
      console.error("Error al subir la foto:", error);
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const updateUserStat = async (field, value) => {
    try {
      const id = user?.id_usuario || user?.id;
      if (!id) return;
      const response = await api.put(`/api/users/${id}`, { [field]: value });
      setUserData(response.data.user || response.data);
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} actualizado`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error("Error al guardar el dato");
    }
  };

  const getUserRank = () => {
    if (displayUser?.id_rol === 1) return "Administrator Access";
    const exp = displayUser?.experiencia || 'Iniciante';
    return `Atleta ${exp.charAt(0).toUpperCase() + exp.slice(1)}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-6 pt-28 text-white font-sans selection:bg-red-600">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HERO CARD USUARIO */}
        <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors duration-700"></div>

          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div
              className="relative group/avatar cursor-pointer active:scale-95 transition-transform"
              onClick={() => !uploading && fileInputRef.current.click()}
            >
              <div className="w-32 h-32 rounded-[2rem] bg-[#1a1a1a] flex items-center justify-center text-5xl font-black italic border border-white/10 shadow-2xl overflow-hidden relative">
                {displayUser?.foto_url ? (
                  <img src={displayUser.foto_url.startsWith('http') ? displayUser.foto_url : `${SERVER_URL}${displayUser.foto_url}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-900/40 opacity-50"></div>
                    <span className="relative z-10">{displayUser?.nombre?.charAt(0)}</span>
                  </>
                )}

                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-center p-2">
                  <span className="text-xl mb-1">{uploading ? '⏳' : '📷'}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">
                    {uploading ? 'Subiendo...' : 'Cambiar Foto'}
                  </span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#111] animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                <div>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-3 justify-center md:justify-start">
                    {displayUser?.nombre} {displayUser?.apellidos}
                  </h1>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    <p className="text-red-600 text-[9px] font-black uppercase tracking-[0.2em] italic">{getUserRank()}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate('/onboarding')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5" title="Configuración Completa">
                    <span className="block text-lg">⚙️</span>
                  </button>
                  <button onClick={logout} className="p-3 bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600/20 transition-all border border-red-600/10" title="Cerrar Sesión">
                    <span className="block text-sm font-black uppercase tracking-widest px-2">Salir</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-white/30 uppercase font-black tracking-[0.15em]">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-red-600 opacity-50 font-serif lowercase italic text-base">@</span> {displayUser?.email}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-red-600 opacity-50">🎯</span> {displayUser?.objetivo?.replace('_', ' ') || 'Definir objetivo'}
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tighter text-white/80">Plan Actual</h3>
                    <p className={`text-lg font-bold ${displayUser?.plan === 'premium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {displayUser?.plan === 'premium' ? 'Premium ' : 'Básico '}
                    </p>
                  </div>
                  {displayUser?.plan === 'basic' && (
                    <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors text-xs uppercase tracking-wider">
                      Upgrade a Premium
                    </button>
                  )}
                </div>
              </div>

              {/* TRAINER COMPONENT INTEGRADO */}
              {trainer && (
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-red-600/30 flex items-center gap-4 hover:border-red-600/60 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-black/50 overflow-hidden border-2 border-red-600/50 flex-shrink-0">
                    {trainer.foto_url ? (
                      <img src={trainer.foto_url.startsWith('http') ? trainer.foto_url : `${SERVER_URL}${trainer.foto_url}`} alt="Entrenador" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-black text-red-600 italic">{trainer.nombre.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Tu Entrenador Asignado</h3>
                    <p className="text-xl font-black italic tracking-tighter text-white">{trainer.nombre} {trainer.apellidos}</p>
                    <p className="text-[10px] text-white/40">{trainer.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/5">
            <StatItem label="Masa Corporal" value={displayUser?.peso} unit="KG" color="bg-red-600" onUpdate={(val) => updateUserStat('peso', val)} />
            <StatItem label="Estatura Total" value={displayUser?.altura} unit="CM" color="bg-white" onUpdate={(val) => updateUserStat('altura', val)} />
            <StatItem label="Gasto Basal" value={macros?.calories} unit="KCAL" color="bg-zinc-700" />
          </div>
        </div>

        {/* PLAN NUTRICIONAL CARD */}
        <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-xl text-center md:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
          <h2 className="text-xs font-black italic uppercase tracking-[0.2em] text-white/20 mb-8 flex items-center gap-3 relative z-10">
            <span className="w-8 h-[1px] bg-white/10 hidden md:block"></span>
            Plan Nutricional Diario
          </h2>

          {macros ? (
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex justify-center lg:w-1/3">
                <div className="relative w-48 h-48 flex items-center justify-center bg-[#0a0a0a] rounded-full border border-white/5 shadow-inner">
                  <div className="absolute inset-1 border-[4px] border-red-600/20 rounded-full"></div>
                  <div className="absolute inset-1 border-[4px] border-red-600 rounded-full border-t-transparent animate-[spin_8s_linear_infinite]"></div>
                  <div className="text-center">
                    <span className="block text-5xl font-black text-white italic tracking-tighter">{macros.calories}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">Kcal / Día</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <MacroBar label="Proteínas" grams={macros.protein} color="bg-red-600" totalKcal={macros.calories} type="protein" />
                <MacroBar label="Carbohidratos" grams={macros.carbs} color="bg-white" totalKcal={macros.calories} type="carbs" />
                <MacroBar label="Grasas" grams={macros.fat} color="bg-zinc-700" totalKcal={macros.calories} type="fat" />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/5 relative z-10">
              <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-4">Sincronización de salud pendiente</p>
              <button onClick={() => navigate('/onboarding')} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all">Vincular Datos Físicos</button>
            </div>
          )}
        </div>

        {/* RUTINA DEL ENTRENADOR CARD */}
        {trainer && (
          <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
            <h2 className="text-xs font-black italic uppercase tracking-[0.2em] text-white/20 mb-8 flex items-center gap-3 relative z-10">
              <span className="w-8 h-[1px] bg-white/10 hidden md:block"></span>
              Rutina Asignada por tu Entrenador
            </h2>
            
            {assignedExercises.length > 0 ? (
              <div className="grid gap-4 relative z-10">
                {assignedExercises.map((exercise) => (
                  <div key={exercise.id_rutina} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-red-600/30 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {exercise.imagen && (
                        <div className="w-24 h-24 rounded-xl bg-black/50 overflow-hidden flex-shrink-0 border border-white/10 mx-auto sm:mx-0">
                          {/* CORRECCIÓN AQUÍ: Concatenar SERVER_URL para que no salgan rotas si son relativas */}
                          <img 
                            src={exercise.imagen.startsWith('http') ? exercise.imagen : `${SERVER_URL}${exercise.imagen}`} 
                            alt={exercise.titulo} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; }} 
                          />
                        </div>
                      )}
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-2 gap-4">
                          <h3 className="text-lg font-black italic uppercase tracking-tighter">{exercise.titulo}</h3>
                          <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                            exercise.dificultad === 'Fácil' ? 'bg-green-600/20 text-green-400' :
                            exercise.dificultad === 'Intermedio' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>{exercise.dificultad || 'Moderado'}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/60 uppercase font-bold tracking-widest">
                            <span>📊 {exercise.series} series</span>
                            <span>🔄 {exercise.repeticiones} reps</span>
                            <span>📅 {new Date(exercise.fecha_asignacion).toLocaleDateString('es-ES')}</span>
                          </div>
                          {exercise.notes || exercise.notas ? (
                            <p className="text-[11px] text-white/50 italic mt-3 p-3 bg-black/30 rounded-lg border-l-2 border-red-600/50">
                              📝 {exercise.notes || exercise.notas}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/5 relative z-10">
                <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-2">Tu entrenador aún no ha asignado ejercicios</p>
                <p className="text-white/20 text-[10px]">Contacta con tu entrenador para recibir tu plan de entrenamiento personalizado.</p>
              </div>
            )}
          </div>
        )}

        {/* ACCESOS DIRECTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <ActivityBlock title="Entrenamiento" action="Explorar" onClick={() => navigate('/workouts')} item={{ title: "Protocolo de Pecho", desc: "45 min • Hipertrofia", tag: "Fuerza", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" }} />
          <ActivityBlock title="Nutrición" action="Recetario" onClick={() => navigate('/recetas')} item={{ title: "Cena Pro-Metabólica", desc: "20 min • Alta Proteína", tag: "Gourmet", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" }} />
        </div>
      </div>
    </div>
  );
}

// Sub-componentes auxiliares integrados limpios
function StatItem({ label, value, unit, color, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  useEffect(() => { setEditValue(value || ''); }, [value]);

  const handleSave = () => {
    const numericValue = Number(editValue);
    const limits = { CM: { min: 100, max: 250 }, KG: { min: 30, max: 300 } };
    const currentLimits = limits[unit] || { min: 0, max: 9999 };

    if (editValue !== '' && !isNaN(numericValue) && numericValue >= currentLimits.min && numericValue <= currentLimits.max && numericValue !== Number(value)) {
      onUpdate(numericValue);
    } else {
      setEditValue(value || '');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setIsEditing(false); setEditValue(value || ''); }
  };

  return (
    <div className="space-y-2 text-center md:text-left group relative">
      <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">{label}</p>
      {isEditing ? (
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-baseline justify-center md:justify-start gap-2 h-10">
            <input
              type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleSave} autoFocus
              className="bg-transparent border-b-2 border-red-600 text-3xl font-black italic tabular-nums text-white focus:outline-none text-center md:text-left"
              style={{ width: `${Math.max(editValue.toString().length + 1, 3)}ch` }}
              step={unit === 'CM' ? "1" : "0.1"}
            />
            <span className="text-[12px] text-red-500 font-black italic uppercase">{unit}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline justify-center md:justify-start gap-2 cursor-pointer group/value" onClick={() => onUpdate && setIsEditing(true)}>
          <p className="text-3xl font-black italic tabular-nums transition-colors group-hover/value:text-red-500">{value || '--'}</p>
          <span className="text-[10px] text-white/10 font-bold uppercase tracking-tighter">{unit}</span>
          {onUpdate && <span className="opacity-0 group-hover/value:opacity-100 ml-2 text-xs transition-opacity">✏️</span>}
        </div>
      )}
      <div className={`h-[2px] w-12 ${color} opacity-40 rounded-full mx-auto md:mx-0 transition-all group-hover:w-full group-hover:opacity-100`} />
      {isEditing && (
        <p className="absolute -bottom-4 left-0 text-[7px] text-white/20 uppercase font-bold tracking-tighter hidden md:block">
          Rango: {unit === 'CM' ? '100-250' : '30-300'}
        </p>
      )}
    </div>
  );
}

function ActivityBlock({ title, action, onClick, item }) {
  return (
    <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 space-y-6 shadow-lg">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-base font-black italic uppercase tracking-tighter">{title}</h3>
        <button onClick={onClick} className="text-[9px] font-black uppercase text-red-600 tracking-widest border-b border-red-600/30">{action}</button>
      </div>
      <div onClick={onClick} className="group relative h-48 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl cursor-pointer">
        <img src={item.img} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 left-4"><span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">{item.tag}</span></div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div><h4 className="text-lg font-black italic uppercase mb-1">{item.title}</h4><p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{item.desc}</p></div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all"><span className="text-xs">→</span></div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, grams, color, totalKcal, type }) {
  const kcalPerGram = type === 'fat' ? 9 : 4;
  const percentage = Math.min(100, Math.round(((grams * kcalPerGram) / totalKcal) * 100)) || 0;
  return (
    <div className="group/bar">
      <div className="flex justify-between items-end mb-2">
        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest group-hover/bar:text-white transition-colors">{label}</span>
        <span className="text-white font-black italic text-lg">{grams}g <span className="text-white/30 font-normal ml-1 text-[10px] not-italic">({percentage}%)</span></span>
      </div>
      <div className="h-3 w-full bg-[#0a0a0a] rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
    </div>
  );
}