import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../components/auth/FormularioInicial";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const manejarCompletado = async (datos) => {
    try {
      const anioNacimiento =
        new Date().getFullYear() - parseInt(datos.edad || 25);
      const fechaNacimiento = `${anioNacimiento}-01-01`;

      const datosAEnviar = {
        peso: datos.peso,
        altura: datos.altura,
        genero: datos.genero,
        fecha_nacimiento: fechaNacimiento,
        nivel_actividad: datos.nivelActividad,
        experiencia: datos.experiencia,
        lugar_entrenamiento: datos.lugarEntrenamiento,
        objetivo: datos.objetivo,
        preferencia_alimentaria: datos.preferenciaAlimentaria,
        tiempo_cocinar: datos.tiempoCocinar,
        onboarding_completado: 1,
      };

      await api.put(`/api/users/${user.id_usuario || user.id}`, datosAEnviar);

      toast.success("¡Perfil guardado!");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al guardar onboarding:", error);
      toast.error(error.response?.data?.error || "Error al guardar el perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 absolute inset-0 z-50">
      <OnboardingWizard onComplete={manejarCompletado} />
    </div>
  );
};

export default Onboarding;
