const express = require('express');
const router = express.Router();
const db = require('../config/database');

// OBTENER todas las recetas locales de tu base de datos
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM recetas ORDER BY id_receta DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// NUEVA RUTA: Buscar recetas externas en TheMealDB por ingrediente principal
// Ejemplo de llamada: http://localhost:3000/api/recipes/external/search/chicken
router.get('/external/search/:ingrediente', async (req, res, next) => {
  try {
    const { ingrediente } = req.params;

    // Llamamos de forma nativa a la API pública de TheMealDB
    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`);
    const data = await apiResponse.json();
    
    const meals = data.meals;
    if (!meals) {
      return res.status(404).json({ message: 'No se encontraron recetas con ese ingrediente en la API global.' });
    }

    // Limitamos a los primeros 6 platos para no saturar el feed
    const primerasRecetas = meals.slice(0, 6);

    // Mapeamos los datos al formato exacto de tu tabla "recetas" de FitMeal
    // Le inventamos macros orientativos y lógicos para que tu diseño HUD no se rompa
    const recetasFormateadas = primerasRecetas.map((meal, index) => {
      return {
        id_receta: `ext-${meal.idMeal}`, // Le ponemos un prefijo para saber en el front que es externa
        titulo: meal.strMeal,
        imagen: meal.strMealThumb,
        tipo: 'Almuerzo',
        calorias: 420 + (index * 15),
        proteinas: 32 + (index * 2),
        carbohidratos: 40,
        grasas: 10
      };
    });

    res.json(recetasFormateadas);
  } catch (error) {
    next(error);
  }
});

// NUEVA RUTA: Obtener los detalles reales (instrucciones e ingredientes) de una receta de TheMealDB
// Ejemplo de llamada: http://localhost:3000/api/recipes/external/details/52772
router.get('/external/details/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await apiResponse.json();
    
    const meal = data.meals?.[0];
    if (!meal) {
      return res.status(404).json({ message: 'Detalles de receta no encontrados.' });
    }

    // Unificamos la lista caótica de ingredientes que devuelve TheMealDB en un string limpio
    let listaIngredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = meal[`strIngredient${i}`];
      const cantidad = meal[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim() !== "") {
        listaIngredientes.push(`${cantidad ? cantidad.trim() : ''} ${ingrediente.trim()}`);
      }
    }

    // Devolvemos el objeto con el mismo formato que espera tu frontend
    res.json({
      id_receta: `ext-${meal.idMeal}`,
      titulo: meal.strMeal,
      imagen: meal.strMealThumb,
      tipo: 'Almuerzo',
      calorias: 450,
      proteinas: 35,
      carbohidratos: 40,
      grasas: 12,
      ingredientes: listaIngredientes.join(', '),
      instrucciones: meal.strInstructions
    });
  } catch (error) {
    next(error);
  }
});

// OBTENER una receta local por id (Se mantiene abajo del todo para no pisar las rutas /external)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM recetas WHERE id_receta = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;