const FavoriteExercise = require('../models/FavoriteExercise');

class FavoritesExercisesController {
  static async getUserFavorites(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const favorites = await FavoriteExercise.getUserFavorites(id_usuario);
      res.json(favorites);
    } catch (error) {
      console.error('Error getting favorite exercises:', error);
      res.status(500).json({ error: 'Error al obtener ejercicios favoritos' });
    }
  }

  static async addFavorite(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_ejercicio = parseInt(req.body.id_ejercicio);
      
      if (!id_ejercicio) {
        return res.status(400).json({ error: 'id_ejercicio es requerido' });
      }

      await FavoriteExercise.addFavorite(id_usuario, id_ejercicio);
      res.status(201).json({ message: 'Ejercicio añadido a favoritos' });
    } catch (error) {
      console.error('Error adding favorite exercise:', error);
      res.status(500).json({ error: 'Error al añadir a favoritos' });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_ejercicio = parseInt(req.params.id_ejercicio);
      
      if (!id_ejercicio) {
        return res.status(400).json({ error: 'id_ejercicio es requerido' });
      }

      await FavoriteExercise.removeFavorite(id_usuario, id_ejercicio);
      res.json({ message: 'Ejercicio eliminado de favoritos' });
    } catch (error) {
      console.error('Error removing favorite exercise:', error);
      res.status(500).json({ error: 'Error al eliminar de favoritos' });
    }
  }
}

module.exports = FavoritesExercisesController;
