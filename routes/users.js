const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas para usuarios
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);

// Rutas protegidas (requieren token)
const upload = require('../middleware/upload');
router.put('/:id', verifyToken, UserController.updateUser);
router.post('/:id/photo', verifyToken, upload.single('foto'), UserController.uploadPhoto);
router.delete('/:id', verifyToken, UserController.deleteUser);

module.exports = router;
