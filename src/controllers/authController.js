const AuthService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const AppError = require('../errors/AppError');
const httpStatus = require('../constants/httpStatus');

const AuthController = {
    // Controlador para el registro de usuarios
    async register(req, res, next) {
        try {
            // 1. Validación de estructura (Zod)
            const validation = validateRegister(req.body);

            if (!validation.succes) {
                // Formateamos los errores de Zod
                const errorMessage = validation.error.errors.map(e => e.message).join(', ');
                throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
            }

            // 2. Llamada al servicio
            const user = await AuthService.registerUser(validation.data);

            // 3. Respuesta
            res.status(httpStatus.CREATED).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            next(error); //Pasa el error al Global Error Handler
        }
    },

    // Controlador para el login de usuarios
    async login(req, res, next) {
        try {
            // 1. Validación de entrada
            const validation = validateLogin(res.body);

            if (!validation.success) {
                const errorMessage = validation.error.errors.map(e => e.message).join(', ');
                throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
            }

            // 2. Lógica de servicio
            const { user, token } = await AuthService.loginUser(validation.data);

            // 3. Respuesta al cliente
            res.status(httpStatus.OK).json({
                status: 'success',
                token, // El Frontend guardará esto
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = AuthController;

//El controlador recibe a petición HTTP, valida el formato con zod, llama al servicio y devuelve una respuesta. No contiene lógica.