const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Mapeo de músculos free-exercise-db → id tabla `musculos`
const MUSCLE_MAP = {
  chest: 1,
  biceps: 2,
  triceps: 14,
  'middle back': 15,
  'lower back': 15,
  lats: 15,
  traps: 15,
  shoulders: 16,
  abdominals: 17,
  forearms: 18,
  quadriceps: 19,
  hamstrings: 20,
  glutes: 21,
  calves: 22,
  abductors: 21,
  adductors: 20,
  neck: 16,
};

// Mapeo de categorías → campo `tipo`
const CATEGORY_MAP = {
  strength: 'Fuerza / Hipertrofia',
  stretching: 'Flexibilidad',
  plyometrics: 'Pliometría',
  strongman: 'Fuerza / Hipertrofia',
  powerlifting: 'Fuerza / Hipertrofia',
  cardio: 'Cardio',
  'olympic weightlifting': 'Fuerza / Hipertrofia',
};

// Mapeo de dificultad
const DIFFICULTY_MAP = {
  beginner: 'Baja',
  intermediate: 'Media',
  expert: 'Alta',
  advanced: 'Alta',
};

function resolveMuscleId(primaryMuscles) {
  if (!primaryMuscles || primaryMuscles.length === 0) return 1;
  const key = primaryMuscles[0].toLowerCase();
  return MUSCLE_MAP[key] || 1;
}

function resolveImagePath(exercise) {
  if (exercise.images && exercise.images.length > 0) {
    return `/exercises/${exercise.id}/0.jpg`;
  }
  return null;
}

function resolvePuntosClave(exercise) {
  const parts = [];
  if (exercise.equipment) parts.push(`Equipo: ${exercise.equipment}`);
  if (exercise.force) parts.push(`Fuerza: ${exercise.force}`);
  if (exercise.mechanic) parts.push(`Mecánica: ${exercise.mechanic}`);
  if (exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0) {
    parts.push(`Músculos secundarios: ${exercise.secondaryMuscles.join(', ')}`);
  }
  return parts.length > 0 ? parts.join(' | ') : null;
}

async function migrate() {
  const datasetPath = path.join(__dirname, 'compartido', 'exercises.json');
  if (!fs.existsSync(datasetPath)) {
    console.error('ERROR: No se encuentra compartido/exercises.json');
    console.error('Ejecuta primero: bash scripts/fetch-exercises-dataset.sh');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitness_platform',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('Iniciando migración: ejercicios desde free-exercise-db...');

    const exercises = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    console.log(`Dataset cargado: ${exercises.length} ejercicios.`);

    console.log('Vaciando tablas rutina_ejercicios y ejercicios...');
    await connection.query('SET FOREIGN_KEY_CHECKS=0');
    await connection.query('TRUNCATE TABLE rutina_ejercicios');
    await connection.query('TRUNCATE TABLE ejercicios');
    await connection.query('SET FOREIGN_KEY_CHECKS=1');

    const BATCH = 50;
    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < exercises.length; i += BATCH) {
      const batch = exercises.slice(i, i + BATCH);
      const values = batch.map((ex) => [
        ex.name,
        resolveMuscleId(ex.primaryMuscles),
        DIFFICULTY_MAP[ex.level?.toLowerCase()] || 'Media',
        Array.isArray(ex.instructions) ? ex.instructions.join('\n') : (ex.instructions || null),
        resolveImagePath(ex),
        CATEGORY_MAP[ex.category?.toLowerCase()] || 'Fuerza / Hipertrofia',
        resolvePuntosClave(ex),
      ]);

      if (values.length === 0) continue;

      await connection.query(
        `INSERT INTO ejercicios (titulo, musculo_id, dificultad, descripcion, imagen, tipo, puntos_clave)
         VALUES ?`,
        [values]
      );

      inserted += values.length;
      process.stdout.write(`\r  Insertados: ${inserted}/${exercises.length}`);
    }

    console.log(`\nMigración completada: ${inserted} ejercicios insertados, ${skipped} omitidos.`);
    console.log('\nVerificación:');
    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM ejercicios');
    console.log(`  SELECT COUNT(*) FROM ejercicios → ${total}`);
  } catch (err) {
    console.error('\nError en migración:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
