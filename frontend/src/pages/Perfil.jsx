import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = user?.id_usuario || user?.id;
        if (!id) return;
        const response = await api.get(`/api/users/${id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Cargando perfil...</div>
      </div>
    );
  }

  const displayUser = userData || user;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
          
          {/* Header section */}
          <div className="h-48 bg-gradient-to-r from-red-600/20 to-red-900/40 relative">
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="px-8 pb-10 relative">
            {/* Profile Avatar */}
            <div className="relative -mt-20 mb-6 flex justify-between items-end">
              <div className="w-32 h-32 rounded-full border-4 border-[#141414] bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                {displayUser?.nombre ? displayUser.nombre.charAt(0).toUpperCase() : (displayUser?.email ? displayUser.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/onboarding')}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 font-medium flex items-center gap-2"
                >
                  <span>✏️</span> Editar Perfil
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-2">{displayUser?.nombre || 'Usuario'}</h1>
              <p className="text-white/60 text-lg flex items-center gap-2">
                <span>✉️</span> {displayUser?.email}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <StatCard label="Peso" value={displayUser?.peso ? `${displayUser.peso} kg` : 'No definido'} icon="⚖️" />
              <StatCard label="Altura" value={displayUser?.altura ? `${displayUser.altura} cm` : 'No definida'} icon="📏" />
              <StatCard label="Objetivo" value={formatObjetivo(displayUser?.objetivo)} icon="🎯" />
              <StatCard label="Nivel Actividad" value={displayUser?.nivel_actividad ? `${displayUser.nivel_actividad}` : 'No definido'} icon="⚡" />
              <StatCard label="Lugar" value={displayUser?.lugar_entrenamiento || 'No definido'} icon="🏋️‍♂️" />
              <StatCard label="Dieta" value={displayUser?.preferencia_alimentaria || 'Sin preferencia'} icon="🥗" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl text-red-500">
        {icon}
      </div>
      <div>
        <div className="text-white/40 text-sm font-medium mb-1">{label}</div>
        <div className="text-white font-semibold text-lg">{value}</div>
      </div>
    </div>
  );
}

function formatObjetivo(objetivo) {
  if (!objetivo) return 'No definido';
  const mapa = {
    'perder_grasa': 'Perder Grasa',
    'ganar_musculo': 'Ganar Músculo',
    'mantenerse': 'Mantenerse'
  };
  return mapa[objetivo] || objetivo;
}
