const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const AppError = require('./errors/AppError');
const globalErrorHandler = require('./middlewares/errorHandler');

const app = express();

// Configurar CORS para permitir acceeso desde Angular y REACT
app.use(cors({
    original: ['http://localhost:4200', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 