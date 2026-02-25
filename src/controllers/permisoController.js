const PermisoModel = require('../models/permisoModel');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/AppError');

// GET /api/permisos - Obtener todos los permisos
exports.getAllPermisos = catchAsync(async(req, res, next) => {
    const permisos = await PermisoModel.findAll();

    res.status(200).json({
        status: 'success',
        result: permisos.length,
        data: permisos
    });
});

// GET /api/permisos/:id - Obtener un permiso por ID
exports.getPermisoById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const permiso = await PermisoModel.findById(id);

    if (!permiso) {
        return next(new AppError('No se encontró el permiso con ese ID', 404));
    }

    res.status(200).json({
        status:'success',
        data: permiso
    });
});

// POST /api/permisos - Crear un nuevo permiso
exports.createPermiso = catchAsync(async(req, res, next) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return next(new AppError('El nombre del permiso es obligatorio', 400));
    }

    const permisoId = await PermisoModel.create({ nombre, descripcion });
    const permiso = await PermisoModel.findById(permisoId);

    res.status(201).json({
        status: 'success',
        data: permiso
    });
});