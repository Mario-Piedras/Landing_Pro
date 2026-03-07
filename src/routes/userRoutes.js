const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const UserController = require('../controllers/userController');

// --- Zona Protegida ---
// A partir de aquí, el usuario DEBE tener token
router.use(protect);

// 1. Obtener todos (Solo quien tenga permiso 'Leer')
// GET /api/v1/users
router.get('/', restrictTo('Leer'), userController.getAll);

// 2. Crear usuario (Solo Admin/Crear)
// POST /api/v1/users
router.post('/', restrictTo('Crear'), UserController.create);

// 3. Actualizar usuario (Solo Admin/Actualizar)
// PUT /api/v1/users/:id
router.put('/:id', restrictTo('Actualizar'), UserController.update);

// 4. Eliminar usuario (Solo Admin/Eliminar)
// DELETE /api/v1/users/:id
router.delete('/:id', restrictTo('Eliminar'), UserController.delete);

module.exports = router;
