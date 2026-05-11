const ExerciseProgress = require('../models/ExerciseProgress');

class ProgressExercisesController {
  static async getProgress(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_ejercicio = parseInt(req.params.id_ejercicio);
      
      if (!id_ejercicio) {
        return res.status(400).json({ error: 'id_ejercicio es requerido' });
      }

      const progress = await ExerciseProgress.getProgress(id_usuario, id_ejercicio);
      res.json(progress);
    } catch (error) {
      console.error('Error getting exercise progress:', error);
      res.status(500).json({ error: 'Error al obtener el progreso del ejercicio' });
    }
  }

  static async addProgress(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const { id_ejercicio, peso, repeticiones } = req.body;
      
      if (!id_ejercicio || peso === undefined) {
        return res.status(400).json({ error: 'id_ejercicio y peso son requeridos' });
      }

      const insertId = await ExerciseProgress.addProgress(id_usuario, parseInt(id_ejercicio), parseFloat(peso), repeticiones ? parseInt(repeticiones) : null);
      res.status(201).json({ message: 'Progreso guardado correctamente', id_progreso: insertId });
    } catch (error) {
      console.error('Error adding exercise progress:', error);
      res.status(500).json({ error: 'Error al guardar el progreso' });
    }
  }

  static async removeProgress(req, res) {
    try {
      const id_usuario = req.user.id_usuario || req.user.id;
      const id_progreso = parseInt(req.params.id_progreso);
      
      if (!id_progreso) {
        return res.status(400).json({ error: 'id_progreso es requerido' });
      }

      await ExerciseProgress.removeProgress(id_usuario, id_progreso);
      res.json({ message: 'Registro de progreso eliminado' });
    } catch (error) {
      console.error('Error removing exercise progress:', error);
      res.status(500).json({ error: 'Error al eliminar el progreso' });
    }
  }
}

module.exports = ProgressExercisesController;
