// modelo de usuario para consultar  en sql 

const db = require('../models/db');

module.exports = {

    findAll: async() => {
        const [rows] = await db.query('SELECT * FROM usuario')
        return rows;
    },


   // buscar por id
    findById : async (id) => {
        const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
        return rows[0]; // Retorna el primer usuario encontrado

    },


  // crear un nuevo usuario
    create: async (data) => {
        const { nombre, documento, correo, contrasena, fk_roll } = data;
        const [result] = await db.query('INSERT INTO usuario (nombre, documento, correo, contrasena, fk_roll) VALUES (?, ?, ?, ?, ?)', 
            [nombre, documento, correo, contrasena, fk_roll]);
        return {id: result.insertId, ...data}// retorna el usuario creado con su id
    },



    // actualizar correo del usuario
    updateEmail: async (id, data) => {
        const { correo} = data;
        await db.query('UPDATE usuario SET correo = ? WHERE id = ?', [correo, id]);
        return { id, ...data }; // Retorna el id y el nuevo correo actualizado
        
    },

    // actualizar  contraseña
    updatepassword: async (id, data) => {
        const { contraseña } = data;
        await db.query('UPDATE usuario SET contraseña = ? WHERE id = ?', [contraseña, id]);
        return { id, ...data }; // Retorna el id y el nuevo correo actualizado
        
    },


        // actualizar correo del usuario
    updateName: async (id, data) => {
        const { nombre } = data;
        await db.query('UPDATE usuario SET nombre = ? WHERE id = ?', [nombre, id]);
        return { id, ...data }; // Retorna el id y el nuevo correo actualizado
        
    },



    // eliminar usuario por id
    remove: async (id) => {
        await db.query('DELETE FROM usuario WHERE id = ?', [id]);
        return { id }; // Retorna el id del usuario eliminado   
    },


    // buscar por email
    findByEmail: async (correo) => {
        const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        return rows[0]; // Retorna el primer usuario encontrado
    },


};
