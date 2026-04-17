import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';

import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const manejarCompletado = async (datos) => {
    try {
      // 1. Mapeamos las variables en camelCase a snake_case que espera MySQL
      const datosAEnviar = {
        peso: datos.peso,
        altura: datos.altura,
        genero: datos.genero,
        nivel_actividad: datos.nivelActividad,
        experiencia: datos.experiencia,
        lugar_entrenamiento: datos.lugarEntrenamiento,
        objetivo: datos.objetivo,
        preferencia_alimentaria: datos.preferenciaAlimentaria,
        tiempo_cocinar: datos.tiempoCocinar,
        onboarding_completado: 1
      };
      
      // 2. Enviamos la petición PUT a nuestro servidor con el ID del usuario
      await api.put(`/api/users/${user.id_usuario || user.id}`, datosAEnviar);
      
      // Aquí podrías actualizar context pero vamos a redirigir
      alert("¡Perfil guardado! Redirigiendo...");
      navigate('/');
    } catch (error) {
      console.error("Error al guardar onboarding:", error);
      const serverDetails = error.response?.data?.details || error.response?.data?.error || error.message;
      alert("Hubo un error del servidor. Aquí está el fallo exacto:\n" + serverDetails);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 absolute inset-0 z-50">
      {/* Añadimos las clases absolute inset-0 z-50 para que el formulario tape el Navbar */}
      <OnboardingWizard onComplete={manejarCompletado} />
    </div>
  );
};

export default Onboarding;
