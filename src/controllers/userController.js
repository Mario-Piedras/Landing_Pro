const UserService = require('../services/userService');
const AppError = require('../errors/AppError');
const httpStatus = require('../constants/httpStatus');
const { validateCreateUser, validateUpdateUser } = require('../validaters/userValidator'); // <--- IMPORTACIÓN NUEVA

const UserController = {
    async getAll(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            res.status(httpStatus.OK).json({
                status: 'success',
                results: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            // Validación con Zod
            const validation = validateCreateUser(req.body);

            if(!validation.success) {
                // Formateamos los errores para que sean legibles
                const errorMessage = validation.error.errors.map(e => e.message).join(', ');
                throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
            }

            // Si pasa, se llama al servicio con los datos ya validados (validation.data)
            // Nota: Usar validation.data es más seguro que req.body porque Zod limpia campos extraños
            const newUser = await UserService.createUser(validation.data);

            res.status(httpStatus.CREATED).json({
                status: 'success',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            //Validation con Zod
            const validation = validateCreateUser(req.body);

            if(!validation.success) {
                const errorMessage = validation.error.errors.map(e => e.message).json(', ');
                throw new AppError('No se enviaron datos para actualizar', httpStatus.BAD_REQUEST);
            }

            // Verificar que al menos envien un dato para actualizar
            if(Object.keys(validation.data).length === 0) {
                throw new AppError('No se enviaron datos para actualizar', httpStatus.BAD_REQUEST);
            }
            
            // llamada al servicio
            const updated = await UserService.updateUser(id, validation.data);

            if (!updated) {
                // Puede que el usuario no exista, pero al servicio ya maneja eso lanzando error si no encuentra ID.
                // Si devuelve false, es porque no hubo cambios o error silencioso.
            }

            res.status(httpStatus.OK).json({
                status: 'success',
                message: 'Usuario actualizado correctamente'
            });
        } catch (error) {
            next(error)
        }
    }
}