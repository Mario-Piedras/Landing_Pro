const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/AppError');
const httpStatus = require('../constants/httpStatus');

/**
 * Controlador para subir imágenes
 * Multer procesa el archivo antes de llegar aqui
 */
exports.uploadImage = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No se recibió ningún archivo', httpStatus.BAD_REQUEST));
    }

    // Construir URL completa del archivo
    const imageUrl = `/upload/${req.file.filename}`;

    res.status(httpStatus.OK).json({
        status: 'success',
        data: {
            filename: req.file.filename,
            url: imageUrl,
            size: req.file.size
        }
    });
});