const express = require('express');
const router = express.Router();
const FavoritesController = require('../controllers/favoritesController');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas de favoritos requieren autenticación
router.use(verifyToken);

router.get('/', FavoritesController.getUserFavorites);
router.post('/', FavoritesController.addFavorite);
router.delete('/:id_receta', FavoritesController.removeFavorite);

module.exports = router;
