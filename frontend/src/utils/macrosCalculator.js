export function calculateMacros(user) {
  if (!user || !user.peso || !user.altura || !user.fecha_nacimiento || !user.genero) {
    return null;
  }

  // 1. Calcular Edad
  const birthDate = new Date(user.fecha_nacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // 2. Calcular Tasa Metabólica Basal (BMR) - Ecuación de Harris-Benedict
  let bmr;
  const genero = user.genero.toLowerCase().trim();
  if (genero === 'masculino' || genero === 'm' || genero === 'hombre') {
    bmr = 88.362 + (13.397 * user.peso) + (4.799 * user.altura) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * user.peso) + (3.098 * user.altura) - (4.330 * age);
  }

  // 3. Multiplicador de Actividad
  const actividad = (user.nivel_actividad || '').toLowerCase().trim();
  let multiplier = 1.2; // Sedentario por defecto
  
  if (actividad.includes('ligero')) multiplier = 1.375;
  else if (actividad.includes('moderado')) multiplier = 1.55;
  else if (actividad.includes('activo') && !actividad.includes('muy')) multiplier = 1.725;
  else if (actividad.includes('muy activo') || actividad.includes('atleta')) multiplier = 1.9;

  let tdee = bmr * multiplier; // Gasto Energético Diario Total (TDEE)

  // 4. Ajuste según Objetivo
  const objetivo = (user.objetivo || '').toLowerCase().trim();
  if (objetivo === 'perder_grasa') {
    tdee -= 500; // Déficit calórico
  } else if (objetivo === 'ganar_musculo') {
    tdee += 500; // Superávit calórico
  }

  // Límite de seguridad para que no den dietas extremas por error
  if (genero === 'femenino' || genero === 'f' || genero === 'mujer') {
    tdee = Math.max(tdee, 1200);
  } else {
    tdee = Math.max(tdee, 1500);
  }

  // 5. Distribución de Macros
  // Proteínas: ~2.2g por kg de peso (ideal para fitness)
  const proteinGrams = Math.round(user.peso * 2.2);
  const proteinKcal = proteinGrams * 4;

  // Grasas: 25% de las calorías totales
  const fatKcal = tdee * 0.25;
  const fatGrams = Math.round(fatKcal / 9);

  // Carbohidratos: El resto de las calorías
  const carbsKcal = tdee - proteinKcal - fatKcal;
  const carbsGrams = Math.max(0, Math.round(carbsKcal / 4));

  return {
    calories: Math.round(tdee),
    protein: proteinGrams,
    fat: fatGrams,
    carbs: carbsGrams
  };
}