const db = require('../models/db');

module.exports = {

    // buscar todos los hogares
    findAll: async() => {
        const [rows] = await db.query('SELECT * FROM hogar');
        return rows;
    },

    // buscar por id
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM hogar WHERE id = ?', [id]);
        return rows[0];
    },  

    // crear hogar
    create: async (hogar) => {
        try {
            const { direccion , ciudad, consumo_estimado, generacion_estimada, fk_usuario, fk_region } = hogar;
            
            const [result] = await db.query('INSERT INTO hogar (direccion, ciudad, consumo_estimado, generacion_estimada, fk_usuario, fk_region) VALUES (?, ?, ?, ?, ?, ?)', [direccion, ciudad, consumo_estimado, generacion_estimada, fk_usuario, fk_region]);
            const nuevoHogar = { id: result.insertId, ...hogar };
            console.log('✅ Hogar creado con ID:', result.insertId);
            return nuevoHogar;
        } catch (error) {
            console.error('❌ Error al crear hogar en BD:', error);
            throw error;
        }
    },


    // actualizar hogar
    update: async (id, hogar) => {
        const { direccion, ciudad, consumo_estimado, generacion_estimada ,fk_region } = hogar;
        await db.query('UPDATE hogar SET direccion = ?, ciudad = ?, consumo_estimado = ?, generacion_estimada = ?, fk_region = ? WHERE id = ?', [direccion, ciudad, consumo_estimado, generacion_estimada, fk_region, id]);
        return { id, ...hogar };
    },

    // eliminar hogar
    delete: async (id) => {
        await db.query('DELETE FROM hogar WHERE id = ?', [id]);
        return { message: 'Hogar eliminado correctamente' };
    }

};