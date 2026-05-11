const FavoriteRecipe = require('../models/FavoriteRecipe');
const User = require('../models/User');

class FavoritesController {
  static async getUserFavorites(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const favorites = await FavoriteRecipe.getUserFavorites(id_usuario);
      res.json(favorites);
    } catch (error) {
      console.error('Error getting favorites:', error);
      res.status(500).json({ error: 'Error al obtener recetas favoritas' });
    }
  }

  static async addFavorite(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_receta = parseInt(req.body.id_receta);
      
      if (!id_receta) {
        return res.status(400).json({ error: 'id_receta es requerido' });
      }

      // Chequear límite de favoritos para plan básico
      const user = await User.findById(id_usuario);
      if (user.plan === 'basic') {
        const favoritesCount = await FavoriteRecipe.getUserFavoritesCount(id_usuario);
        if (favoritesCount >= 5) {
          return res.status(403).json({ error: 'Límite de 5 favoritos alcanzado. Actualiza a premium para más.' });
        }
      }

      await FavoriteRecipe.addFavorite(id_usuario, id_receta);
      res.status(201).json({ message: 'Receta añadida a favoritos' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ error: 'Error al añadir a favoritos' });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_receta = parseInt(req.params.id_receta);
      
      if (!id_receta) {
        return res.status(400).json({ error: 'id_receta es requerido' });
      }

      await FavoriteRecipe.removeFavorite(id_usuario, id_receta);
      res.json({ message: 'Receta eliminada de favoritos' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ error: 'Error al eliminar de favoritos' });
    }
  }
}

module.exports = FavoritesController;
