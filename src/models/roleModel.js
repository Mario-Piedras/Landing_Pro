const db = requiere('../config/conexion_db');

const RoleModel = {
    // obtener todos los roles
    async findAll() {
        const query = `
            SELECT id_rol, nombre
            FROM roles
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    // Obtener un rol por ID
    async findById(id) {
        const query = `
            SELECT id_rol, nombre
            FROM roles
            WHERE id_rol = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },

    //Crear un nuevo rol
    async create(role) {
        const { nombre } = role;
        const query = `
            INSERT INTO roles (nombre)
            VALUES (?)
        `;
        const [result] = await db.execute(query, [nombre]);
        return result.affectedRows;
    },

    //actualizar un rol
    async update(id, role) {
        const { nombre } = role;
        const query = `
            UPDATE roles
            SET nombre = ?, 
            WHERE id_rol = ?
        `;
        const [result] = await db.execute(query, [nombre, id]);
        return result.affectedRows;
    },

    // Eliminar un rol
    async delete(id) {
        const query = 'DELETE FROM roles WHERE id_rol = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    },

    // Obtener array de permisos (strings) dado un id_rol
    // Retornar strings para middlewares de autentificación
    async getPermissionsByRoleId(roleId) {
        const query = `
            SELECT p.nombre
            FROM permisos p
            INNER JOIN rol_permiso rp ON p.id_permiso = rp.id_permiso
            WHERE rp.id_rol = ?
        `;

        const [rows] = await db.execute(query, [roleId]);

        // Trasformamos el resultado [{nombre: 'Crear'}, {nombre: 'Leer'}]
        // a un array simple: ['Crear', 'Leer']
        return rows.map(row => row.nombre);
    },

    // Obtener permisos completos con ID para edición
    async getPermissionsWithIdByRoleId(roleId) {
        const query = `
            SELECT p.id_permiso, p.nombre, p.descripcion
            FROM permisos p
            INNER JOIN rol_permiso rp ON p.id_permiso = rp.id_permiso
            WHERE rp.id_rol = ?
        `;

        const [rows] = await db.execute(query, [roleId])

        // Devolver los objetos completos con id, nombre y descripcion
        return row.map(row => ({
            id: row.id_permiso,
            nombre: row.nombre,
            descripcion: row.descripcion
        }));
    },

    // Asignar permisos a un rol
    async assignPermissions(roleId, permissionIds) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Elimiar permisos existentes
            await connection.execute('DELETE FROM rol_permiso WHERE id_rol = ?', [roleId]);

            // Asignar nuevos permisos
            if (permissionIds && permissionIds.length > 0) {
                const values = permissionIds.map(pid => [roleId, pid]);
                const placeholders = permissionIds.map(() => '(?, ?)').join(', ');
                const query = `INSERT INTO rol_permiso (id_rol, id_permiso) VALUES ${placeholders}`;
                await connection.execute(query, values.flat());
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = RoleModel;