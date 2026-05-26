const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurada en tu .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function translateBatch(exercises) {
  const prompt = `
  Eres un traductor profesional experto en fitness. Traduce al español los siguientes ejercicios manteniendo un tono profesional.
  Devuelve ÚNICAMENTE un array JSON válido, sin formato markdown (\`\`\`json) ni texto adicional.
  
  Aquí están los ejercicios a traducir:
  ${JSON.stringify(exercises.map(e => ({
    id: e.id,
    titulo: e.titulo,
    descripcion: e.descripcion,
    puntos_clave: e.puntos_clave
  })))}
  
  Debes devolver un array de objetos con esta estructura exacta:
  [
    {
      "id": id_original,
      "titulo_es": "Título traducido",
      "descripcion_es": "Descripción técnica traducida con precisión",
      "puntos_clave_es": "Puntos clave traducidos (ej: Equipo: Mancuernas | Fuerza: Empuje | Mecánica: Compuesto | Músculos secundarios: Hombros, Tríceps)"
    }
  ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    return JSON.parse(text);
  } catch (error) {
    // Extraer el retryDelay sugerido por la API (ej: "Please retry in 32.6s")
    const retryMatch = error.message.match(/retry in (\d+(?:\.\d+)?)s/);
    const waitMs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) * 1000 + 3000 : 65000;
    console.error(`❌ Error Gemini: ${error.message.split('\n')[0]}`);
    console.log(`⏳ Esperando ${Math.round(waitMs / 1000)}s (tiempo sugerido por la API)...`);
    await new Promise(res => setTimeout(res, waitMs));
    return null;
  }
}

async function start() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitness_platform',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('🔄 Verificando esquema de la base de datos...');
    // Añadimos una columna para saber si ya se ha traducido (así el script es reanudable)
    try {
      await connection.query('ALTER TABLE ejercicios ADD COLUMN traducido BOOLEAN DEFAULT FALSE;');
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      // Si la columna ya existe, simplemente ignoramos el error
    }

    // Comprobamos cuántos faltan por traducir
    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM ejercicios WHERE traducido = FALSE');
    console.log(`\n📊 Ejercicios pendientes de traducción: ${total}`);

    if (total === 0) {
      console.log('✅ ¡Todos los ejercicios ya están traducidos!');
      return;
    }

    const BATCH_SIZE = 5; // Lotes de 5 para no saturar a Gemini
    let procesados = 0;

    while (true) {
      const [pendientes] = await connection.query(
        'SELECT id, titulo, descripcion, puntos_clave FROM ejercicios WHERE traducido = FALSE LIMIT ?',
        [BATCH_SIZE]
      );

      if (pendientes.length === 0) break;

      console.log(`\n🚀 Traduciendo lote de ${pendientes.length} ejercicios...`);
      
      const translations = await translateBatch(pendientes);

      if (!translations || !Array.isArray(translations)) {
          continue;
      }

      for (const t of translations) {
        if (!t.titulo_es || !t.descripcion_es) continue;
        
        await connection.query(
          'UPDATE ejercicios SET titulo = ?, descripcion = ?, puntos_clave = ?, traducido = TRUE WHERE id = ?',
          [t.titulo_es, t.descripcion_es, t.puntos_clave_es || null, t.id]
        );
      }

      procesados += pendientes.length;
      console.log(`✅ Lote completado. Progreso actual: ~${procesados} ejercicios traducidos en esta sesión.`);
      
      // Pequeña pausa para no superar límites de cuota de Gemini gratuita
      await new Promise(res => setTimeout(res, 2000));
    }

    console.log('\n🎉 ¡Traducción de todos los ejercicios finalizada con éxito!');

  } catch (err) {
    console.error('\n❌ Error en el script:', err.message);
  } finally {
    await connection.end();
  }
}

start();
