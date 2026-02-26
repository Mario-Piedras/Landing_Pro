-- CONFIFURACIÓN INICIAL
CREATE DATABASE IF NOT EXISTS landing
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE landing;

-- NIVEL 1: SISTEMA DE USUARIOS Y ROLES (Base existente)

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE rol_permiso (
    id_rol_permiso INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT,
    id_permiso INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY, -- Nota: Es INT (Signed)
    tipo_identificacion ENUM('CC', 'NIT', 'PASAPORTE', 'TI', 'CE') DEFAULT 'CC',
    nuip VARCHAR(20),
    nombre VARCHAR(100),
    email VARCHAR(300) UNIQUE, -- Agregado UNIQUE por seguridad
    clave VARCHAR(500),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla de Negocio
CREATE TABLE negocio (
    id_negocio INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(100),
    logo_url VARCHAR(512), -- OPTIMIZACIÓN: URL en vez de BLOB para no pesar la BD
    descripcion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(255),
    redes_sociales JSON, -- MEJORA: JSON es mejor para guardar {fb: url, ig: url}
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1. Roles
INSERT INTO roles (nombre) VALUES ('Administrador'), ('Empleado'), ('Cliente');

-- 2. Permisos
INSERT INTO permisos (nombre, descripcion) VALUES
('Crear', 'Permite crear nuevos registro'),
('Leer', 'Permite visualizar registro'),
('Actualizar', 'Permite modificar registro existentes'),
('Eliminar', 'Permite eliminar registro');

-- 3. Asignación Permisos (Admin)
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES (1, 1), (1, 2), (1, 3), (1, 4);
-- Asignación Permisos (Empleado/Cliente)
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES (2, 2), (3, 2);

-- 4. Usuarios
-- Admin (Pass: 1)
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES
('Admin', 'dhanymarth@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHU1ihTtioa6', 1);

-- Empleado (Pass: 1)
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES
('Empleado', 'empleado@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHU1ihTtioa6', 2);
