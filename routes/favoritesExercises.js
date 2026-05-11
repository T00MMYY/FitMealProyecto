const express = require('express');
const router = express.Router();
const FavoritesExercisesController = require('../controllers/favoritesExercisesController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', FavoritesExercisesController.getUserFavorites);
router.post('/', FavoritesExercisesController.addFavorite);
router.delete('/:id_ejercicio', FavoritesExercisesController.removeFavorite);

module.exports = router;
