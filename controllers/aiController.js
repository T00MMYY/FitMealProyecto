const db = require('../config/database');
const User = require('../models/User');
const { getModel } = require('../config/gemini');

class AiController {

  static async generatePlan(req, res) {
    try {
      const id_usuario = req.user.id_usuario ?? req.user.id;

      // 1. Perfil del usuario
      const user = await User.findById(id_usuario);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      // 2. Ejercicios disponibles con grupo muscular
      const [ejercicios] = await db.query(`
        SELECT e.id, e.titulo, e.dificultad, e.tipo, m.nombre_key AS musculo, m.grupo_muscular
        FROM ejercicios e
        LEFT JOIN musculos m ON e.musculo_id = m.id
        ORDER BY m.grupo_muscular, e.titulo
      `);

      // 3. Recetas disponibles
      const [recetas] = await db.query(`
        SELECT id_receta, titulo, calorias, proteina, carbohidratos, grasas, tiempo, tipo
        FROM recetas
        ORDER BY tipo, calorias
      `);

      // 4. Construir prompt
      const prompt = buildPrompt(user, ejercicios, recetas);

      // 5. Llamar a Gemini
      const model = getModel();
      const result = await model.generateContent(prompt);
      const raw = result.response.text();

      // 6. Extraer JSON de la respuesta (Gemini puede envolver el JSON en markdown)
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) throw new Error('La IA no devolvió un JSON válido');
      const plan = JSON.parse(jsonMatch[1]);

      // 7. Guardar rutina en BD (reemplazar la generada por IA anterior)
      await saveRutina(id_usuario, plan.rutina);

      // 8. Guardar plan de comida para los próximos 7 días
      await savePlanComida(id_usuario, plan.plan_comida);

      res.json({
        message: 'Plan generado correctamente',
        rutina: plan.rutina,
        plan_comida: plan.plan_comida
      });

    } catch (error) {
      console.error('❌ Error generando plan con IA:', error.message);
      if (error.message.includes('GEMINI_API_KEY')) {
        return res.status(503).json({ error: 'Servicio de IA no configurado' });
      }
      res.status(500).json({ error: 'Error al generar el plan', details: error.message });
    }
  }

  static async getPlanComida(req, res) {
    try {
      const id_usuario = req.user.id_usuario ?? req.user.id;
      const [rows] = await db.query(`
        SELECT pc.id, pc.momento, pc.fecha, pc.generado_ia,
               r.id_receta, r.titulo, r.calorias, r.proteina, r.carbohidratos, r.grasas, r.tiempo, r.tipo, r.imagen
        FROM plan_comida pc
        JOIN recetas r ON pc.id_receta = r.id_receta
        WHERE pc.id_usuario = ? AND pc.fecha >= CURDATE()
        ORDER BY pc.fecha, FIELD(pc.momento, 'desayuno','almuerzo','comida','merienda','cena')
      `, [id_usuario]);
      res.json(rows);
    } catch (error) {
      console.error('Error obteniendo plan de comida:', error);
      res.status(500).json({ error: 'Error al obtener el plan de comida' });
    }
  }
}

function buildPrompt(user, ejercicios, recetas) {
  const perfil = {
    objetivo: user.objetivo || 'No especificado',
    nivel_actividad: user.nivel_actividad || 'Moderado',
    experiencia: user.experiencia || 'Intermedio',
    lugar: user.lugar_entrenamiento || 'Gimnasio',
    preferencia_alimentaria: user.preferencia_alimentaria || 'Sin preferencia',
    tiempo_cocinar: user.tiempo_cocinar || 'menos_30',
    peso: user.peso || null,
    altura: user.altura || null,
    genero: user.genero || null,
  };

  const listaEjercicios = ejercicios.map(e =>
    `{id:${e.id}, nombre:"${e.titulo}", musculo:"${e.musculo}", grupo:"${e.grupo_muscular}", dificultad:"${e.dificultad}"}`
  ).join('\n');

  const listaRecetas = recetas.map(r =>
    `{id:${r.id_receta}, nombre:"${r.titulo}", tipo:"${r.tipo}", kcal:${r.calorias}, proteina:${r.proteina}g, tiempo:${r.tiempo}min}`
  ).join('\n');

  return `Eres un entrenador personal y nutricionista experto.
Crea una rutina semanal de ejercicios y un plan de comidas para 7 días basándote en el perfil del usuario y ÚNICAMENTE los ejercicios y recetas disponibles que te proporciono.

PERFIL DEL USUARIO:
${JSON.stringify(perfil, null, 2)}

EJERCICIOS DISPONIBLES:
${listaEjercicios}

RECETAS DISPONIBLES:
${listaRecetas}

INSTRUCCIONES:
- Selecciona entre 8 y 14 ejercicios para la rutina, variando grupos musculares.
- Crea el plan de comidas para 7 días (dia_offset 0=hoy hasta 6).
- Incluye desayuno, comida y cena cada día. Añade almuerzo o merienda si encaja con el objetivo.
- Respeta la preferencia alimentaria y el tiempo de cocina del usuario.
- Adapta la dificultad y series a la experiencia del usuario.

Responde ÚNICAMENTE con este JSON sin texto adicional:
{
  "rutina": {
    "nombre": "string",
    "descripcion": "string",
    "dias_semana": "string (ej: Lunes,Miércoles,Viernes)",
    "nivel": "Baja|Media|Alta",
    "ejercicios": [
      {"id_ejercicio": number, "series": number, "repeticiones": number, "peso_objetivo": number|null, "descanso_segundos": number, "orden": number}
    ]
  },
  "plan_comida": [
    {"dia_offset": number, "momento": "desayuno|almuerzo|comida|merienda|cena", "id_receta": number}
  ]
}`;
}

async function saveRutina(id_usuario, rutina) {
  // Eliminar rutina anterior generada por IA para este usuario
  const [existing] = await db.query(
    'SELECT id FROM rutinas WHERE id_usuario = ? AND descripcion LIKE "%IA%" ORDER BY created_at DESC LIMIT 1',
    [id_usuario]
  );
  if (existing.length > 0) {
    await db.query('DELETE FROM rutinas WHERE id = ?', [existing[0].id]);
  }

  const [result] = await db.query(
    'INSERT INTO rutinas (id_usuario, nombre, descripcion, dias_semana, nivel) VALUES (?, ?, ?, ?, ?)',
    [id_usuario, rutina.nombre, `[IA] ${rutina.descripcion}`, rutina.dias_semana, rutina.nivel]
  );
  const id_rutina = result.insertId;

  for (const ej of rutina.ejercicios) {
    await db.query(
      'INSERT INTO rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, peso_objetivo, descanso_segundos, orden) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_rutina, ej.id_ejercicio, ej.series, ej.repeticiones, ej.peso_objetivo ?? null, ej.descanso_segundos ?? 60, ej.orden]
    );
  }
  return id_rutina;
}

async function savePlanComida(id_usuario, planComida) {
  // Eliminar plan futuro generado por IA
  await db.query(
    'DELETE FROM plan_comida WHERE id_usuario = ? AND fecha >= CURDATE() AND generado_ia = 1',
    [id_usuario]
  );

  const today = new Date();
  for (const item of planComida) {
    const fecha = new Date(today);
    fecha.setDate(today.getDate() + item.dia_offset);
    const fechaStr = fecha.toISOString().split('T')[0];

    await db.query(
      'INSERT INTO plan_comida (id_usuario, id_receta, momento, fecha, generado_ia) VALUES (?, ?, ?, ?, 1)',
      [id_usuario, item.id_receta, item.momento, fechaStr]
    );
  }
}

module.exports = AiController;
