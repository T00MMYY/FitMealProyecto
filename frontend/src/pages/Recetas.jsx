import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Recetas() {
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [recetasDB, setRecetasDB] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recetasRes, favRes] = await Promise.all([
          api.get('/api/recipes'),
          api.get('/api/favorites').catch(() => ({ data: [] })) // Captura error si no está logueado
        ]);
        setRecetasDB(recetasRes.data);
        setFavoritos(favRes.data.map(f => f.id_receta));
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (e, id_receta) => {
    e.preventDefault(); // Evita navegar al detalle de la receta
    try {
      const isFav = favoritos.includes(id_receta);
      if (isFav) {
        await api.delete(`/api/favorites/${id_receta}`);
        setFavoritos(prev => prev.filter(id => id !== id_receta));
      } else {
        await api.post('/api/favorites', { id_receta });
        setFavoritos(prev => [...prev, id_receta]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      // Podría mostrarse un mensaje de error si no está autenticado
    }
  };

  const filtros = ['Todas', 'Favoritas', 'Vegano', 'Volumen', 'Definición', 'Keto', 'Alta Proteína', 'Snack'];

  const recetasFiltradas = recetasDB.filter(r => {
    if (filtroActivo === 'Todas') return true;
    if (filtroActivo === 'Favoritas') return favoritos.includes(r.id_receta);
    return r.tipo === filtroActivo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-black italic text-4xl">
        CARGANDO FITMEALS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-8xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6">
            FIT<span className="text-primary">MEALS</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <p className="text-white/40 text-xl font-medium max-w-xl">
              Alcanza tus macros sin sacrificar el sabor. Filtra por tu objetivo y descubre tu nueva comida favorita.
            </p>
            
            {/* FILTROS */}
            <div className="flex flex-wrap gap-2">
              {filtros.map(filtro => (
                <button
                  key={filtro}
                  onClick={() => setFiltroActivo(filtro)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    filtroActivo === filtro 
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(211,15,21,0.4)] scale-105' 
                      : 'bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GRID DE RECETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetasFiltradas.map(receta => {
            const isFav = favoritos.includes(receta.id_receta);
            return (
              <Link 
                to={`/recetas/${receta.id_receta}`} 
                key={receta.id_receta}             
                className="group block bg-[#121212] rounded-[30px] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative"
              >
                <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
                  <img 
                    src={receta.imagen_url} 
                    alt={receta.titulo} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80"></div>
                  
                  {/* Etiqueta Tiempo */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-primary font-black uppercase tracking-widest text-[9px]">
                      {receta.tiempo} MIN
                    </span>
                  </div>

                  {/* Botón Favorito */}
                  <button 
                    onClick={(e) => toggleFavorite(e, receta.id_receta)}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-transform z-10"
                    title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <span className={`text-xl transition-colors duration-300 ${isFav ? 'text-primary' : 'text-white/50 grayscale'}`}>
                      {isFav ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black italic uppercase leading-tight mb-4 group-hover:text-primary transition-colors">
                    {receta.titulo}
                  </h3>
                  
                  <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                        {receta.calorias} Kcal
                      </span>
                    </div>
                    <div className="w-px h-4 bg-white/10"></div>
                    <div className="flex items-center gap-2 relative">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        {receta.proteina}g Proteína
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {recetasFiltradas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-2xl font-black uppercase italic tracking-widest">
              No hay recetas para este filtro
            </p>
          </div>
        )}

      </div>
    </div>
  );
}