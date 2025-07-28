const db = require('../models/db');



module.exports = {

    // Obtener todos los electrodomésticos
    findAll: async() => {
                const [rows] = await db.query('SELECT * FROM electrodomestico')
                return rows;
    },

    // buscar por id
    findById : async (id) => {
        const [rows] = await db.query('SELECT * FROM electrodomestico WHERE id = ?', [id]);
        return rows[0]; // Retorna el primer electrodoméstico encontrado
    },

    // obtener  el consumo de un electrodoméstico
    getConsumo: async (id) => {
        const [rows] = await db.query('SELECT consumo FROM electrodomestico WHERE id = ?', [id]);
        return rows[0] ? rows[0].consumo : null; // Retorna el consumo del electrodoméstico
    },


};