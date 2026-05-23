import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Recetas() {
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [recetasDB, setRecetasDB] = useState([]);
  const [recetasExternas, setRecetasExternas] = useState([]);
  const [origenMenu, setOrigenMenu] = useState('locales'); // 'locales' o 'globales'
  const [ingredienteFiltro, setIngredienteFiltro] = useState('chicken'); // 'chicken', 'tuna', 'beef'
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  // 1. Cargar recetas locales de MySQL y tus favoritos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recetasRes, favRes] = await Promise.all([
          api.get('/api/recipes'),
          api.get('/api/favorites').catch(() => ({ data: [] }))
        ]);
        setRecetasDB(recetasRes.data || []);
        setFavoritos(favRes.data?.map(f => f.id_receta) || []);
      } catch (err) {
        console.error("Error cargando datos locales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Cargar recetas desde el endpoint de la API externa (TheMealDB)
  useEffect(() => {
    if (origenMenu !== 'globales') return;
    
    const fetchGlobalData = async () => {
      setLoadingGlobal(true);
      try {
        const res = await api.get(`/api/recipes/external/search/${ingredienteFiltro}`);
        setRecetasExternas(res.data || []);
      } catch (err) {
        console.error("Error cargando recetas globales:", err);
        setRecetasExternas([]);
      } finally {
        setLoadingGlobal(false);
      }
    };
    fetchGlobalData();
  }, [ingredienteFiltro, origenMenu]);

  const toggleFavorite = async (e, id_receta) => {
    e.preventDefault();
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
    }
  };

  const filtros = ['Todas', 'Favoritas', 'Vegano', 'Volumen', 'Definición', 'Keto', 'Alta Proteína', 'Snack'];
  const filtrosGlobales = [
    { id: 'chicken', label: '🍗 Pollo' },
    { id: 'tuna', label: '🐟 Atún' },
    { id: 'beef', label: '🥩 Ternera' }
  ];

  const recetasFiltradas = recetasDB.filter(r => {
    if (filtroActivo === 'Todas') return true;
    if (filtroActivo === 'Favoritas') return favoritos.includes(r.id_receta);
    return r.tipo === filtroActivo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-black italic text-4xl">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 space-y-12">
        
        {/* ENCABEZADO */}
        <div>
          <h1 className="text-8xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6">
            FIT<span className="text-primary">MEALS</span>
          </h1>
          <p className="text-white/40 text-xl font-medium max-w-xl">
            Alcanza tus macros sin sacrificar el sabor. Filtra por tu objetivo y descubre tu nueva comida favorita.
          </p>
        </div>

        {/* CONTROLES HUD: INTERRUPTOR DE ORIGEN */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-[#121212] p-4 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex p-1 bg-black/40 rounded-full border border-white/5 w-full md:w-auto">
            <button
              onClick={() => setOrigenMenu('locales')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                origenMenu === 'locales' ? 'bg-primary text-black shadow-lg scale-105' : 'text-white/40 hover:text-white'
              }`}
            >
              Nuestras Recetas
            </button>
            <button
              onClick={() => setOrigenMenu('globales')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                origenMenu === 'globales' ? 'bg-primary text-black shadow-lg scale-105' : 'text-white/40 hover:text-white'
              }`}
            >
              Buscador Global
            </button>
          </div>

          {/* FILTROS SEGÚN EL MENÚ SELECCIONADO */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {origenMenu === 'locales' ? (
              filtros.map(filtro => (
                <button
                  key={filtro}
                  onClick={() => setFiltroActivo(filtro)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    filtroActivo === filtro 
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(211,15,21,0.4)]' 
                      : 'bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  {filtro}
                </button>
              ))
            ) : (
              filtrosGlobales.map(f => (
                <button
                  key={f.id}
                  onClick={() => setIngredienteFiltro(f.id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    ingredienteFiltro === f.id 
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(211,15,21,0.4)]' 
                      : 'bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* GRID DE RESULTADOS */}
        {origenMenu === 'globales' && loadingGlobal ? (
          <div className="text-center py-24 text-white/30 animate-pulse text-sm font-black uppercase tracking-widest">
            Sincronizando con el servidor internacional...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(origenMenu === 'locales' ? recetasFiltradas : recetasExternas).map(receta => {
              const isFav = favoritos.includes(receta.id_receta);
              // Corrección segura de nombres de variables para unificar ambos mundos (locales y externos)
              const proteinas = receta.proteina || receta.proteinas || 0;
              const carbohidratos = receta.carbohidratos || receta.carbs || 0;
              
              return (
                <Link 
                  to={`/recetas/${receta.id_receta}`} 
                  key={receta.id_receta}             
                  className="group block bg-[#121212] rounded-[30px] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative flex flex-col justify-between shadow-2xl"
                >
                  <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
                    <img 
                      src={receta.imagen} 
                      alt={receta.titulo} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80"></div>
                    
                    {receta.tiempo && (
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span className="text-primary font-black uppercase tracking-widest text-[9px]">
                          {receta.tiempo} MIN
                        </span>
                      </div>
                    )}

                    {/* El botón de favorito solo aplica para recetas locales */}
                    {!String(receta.id_receta).startsWith('ext-') && (
                      <button 
                        onClick={(e) => toggleFavorite(e, receta.id_receta)}
                        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-transform z-10"
                        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                      >
                        <span className={`text-xl transition-colors duration-300 ${isFav ? 'text-primary' : 'text-white/50 grayscale'}`}>
                          {isFav ? '❤️' : '🤍'}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <h3 className="text-2xl font-black italic uppercase leading-tight mb-6 line-clamp-2 group-hover:text-primary transition-colors">
                      {receta.titulo}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          {receta.calorias} Kcal
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/10"></div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                          {proteinas}g Proteína
                        </span>
                      </div>
                      {carbohidratos > 0 && (
                        <>
                          <div className="w-px h-4 bg-white/10"></div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                              {carbohidratos}g Carbs
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* PANTALLA DE RESULTADOS VACÍOS */}
        {origenMenu === 'locales' && recetasFiltradas.length === 0 && (
          <div className="text-center py-24 bg-[#121212] rounded-[2rem] border border-dashed border-white/5">
            <p className="text-white/40 text-xl font-black uppercase italic tracking-widest">
              No hay recetas registradas para este filtro
            </p>
          </div>
        )}

      </div>
    </div>
  );
}