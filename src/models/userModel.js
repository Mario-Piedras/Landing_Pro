// Ajusta la ruta si tu archivo se llama conexion_deb.js dentro de config
const db = requiere('../config/conexion_db');

const UserModel = {
    async findByEmail(email) {
        const query = `
            SELECT u.id_usuario, u.nombre, u.email, u.clave, u.id_rol, r.nombre as rol_nombre
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.email = ?
        `;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    
}