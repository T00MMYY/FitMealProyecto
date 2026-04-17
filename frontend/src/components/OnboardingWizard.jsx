import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos Físicos
    edad: '',
    peso: '',
    altura: '',
    genero: '',
    // Paso 2: Actividad
    nivelActividad: '',
    experiencia: '',
    lugarEntrenamiento: '',
    // Paso 3: Nutrición y Metas
    objetivo: '',
    preferenciaAlimentaria: '',
    tiempoCocinar: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí enviarás los datos a tu backend / API
    console.log('Datos finales del onboarding:', formData);
    if (onComplete) onComplete(formData);
  };

  // Variantes para la animación de framer-motion
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-gray-700">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Paso {step} de 3</span>
            <span className="font-medium text-emerald-400">{Math.round((step / 3) * 100)}% Completado</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" custom={1}>
              
              {/* PASO 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Conociéndote 👤</h2>
                  <p className="text-gray-400 mb-6">Necesitamos estos datos para calcular tu gasto calórico (TDEE).</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Edad</label>
                      <input 
                        type="number" name="edad" required value={formData.edad} onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Ej. 25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Peso (kg)</label>
                      <input 
                        type="number" name="peso" required value={formData.peso} onChange={handleChange} step="0.1"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Ej. 70.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Altura (cm)</label>
                      <input 
                        type="number" name="altura" required value={formData.altura} onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Ej. 175"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
                      <div className="flex gap-4">
                        <label className="flex items-center text-gray-300 cursor-pointer">
                          <input type="radio" name="genero" value="masculino" required checked={formData.genero === 'masculino'} onChange={handleChange} className="mr-2 accent-emerald-500" />
                          Masc.
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer">
                          <input type="radio" name="genero" value="femenino" required checked={formData.genero === 'femenino'} onChange={handleChange} className="mr-2 accent-emerald-500" />
                          Fem.
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PASO 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={1}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Tu Actividad ⚡</h2>
                  <p className="text-gray-400 mb-6">¿Cómo te mueves en tu día a día?</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nivel de Actividad Diaria</label>
                      <select name="nivelActividad" required value={formData.nivelActividad} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                        <option value="">Selecciona una opción...</option>
                        <option value="1.20">Sedentario (Trabajo de oficina, poco mov.)</option>
                        <option value="1.37">Ligero (Caminas a diario, poco ejercicio)</option>
                        <option value="1.55">Moderado (Entrenas 3-4 veces x semana)</option>
                        <option value="1.72">Intenso (Entrenas +5 veces o trabajo físico)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nivel de Experiencia</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Principiante', 'Intermedio', 'Avanzado'].map(nivel => (
                          <label key={nivel} className={`border rounded-lg text-center p-2 cursor-pointer transition-colors ${formData.experiencia === nivel ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>
                            <input type="radio" name="experiencia" value={nivel} className="hidden" onChange={handleChange} required />
                            {nivel}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Lugar de Entrenamiento</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={`border rounded-lg text-center p-3 cursor-pointer transition-colors ${formData.lugarEntrenamiento === 'Gimnasio' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>
                          <input type="radio" name="lugarEntrenamiento" value="Gimnasio" className="hidden" onChange={handleChange} required />
                          🏋️‍♂️ Gimnasio
                        </label>
                        <label className={`border rounded-lg text-center p-3 cursor-pointer transition-colors ${formData.lugarEntrenamiento === 'Casa' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>
                          <input type="radio" name="lugarEntrenamiento" value="Casa" className="hidden" onChange={handleChange} required />
                          🏠 En Casa
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PASO 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={1}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Metas y Nutrición 🥗</h2>
                  <p className="text-gray-400 mb-6">Ajustemos tu menú y objetivos.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">¿Cuál es tu objetivo?</label>
                      <select name="objetivo" required value={formData.objetivo} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                        <option value="">Selecciona tu meta...</option>
                        <option value="perder_grasa">Perder Grasa (Déficit calórico)</option>
                        <option value="ganar_musculo">Ganar Masa Muscular (Volumen)</option>
                        <option value="mantenerse">Mantener Peso / Salud General</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Preferencia Alimentaria</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Sin preferencia', 'Vegano/Vegetariano', 'Keto'].map(pref => (
                          <label key={pref} className={`col-span-2 sm:col-span-1 border rounded-lg text-center p-2 cursor-pointer transition-colors ${formData.preferenciaAlimentaria === pref ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>
                            <input type="radio" name="preferenciaAlimentaria" value={pref} className="hidden" onChange={handleChange} required />
                            {pref}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Tiempo para cocinar</label>
                      <div className="flex gap-4">
                        <label className="flex items-center text-gray-300 cursor-pointer">
                          <input type="radio" name="tiempoCocinar" value="menos_20" required checked={formData.tiempoCocinar === 'menos_20'} onChange={handleChange} className="mr-2 accent-emerald-500" />
                          &lt; 20 min (Rápidas)
                        </label>
                        <label className="flex items-center text-gray-300 cursor-pointer">
                          <input type="radio" name="tiempoCocinar" value="mas_20" required checked={formData.tiempoCocinar === 'mas_20'} onChange={handleChange} className="mr-2 accent-emerald-500" />
                          + 20 min
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 border-t border-gray-700 pt-6">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors font-medium"
              >
                Anterior
              </button>
            ) : <div></div>}

            <button 
              type="submit"
              className="px-8 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95"
            >
              {step === 3 ? 'Completar Perfil' : 'Siguiente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingWizard;
