const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

//Importaciones de las rutas de autenticación
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
//Se definen los endpoints