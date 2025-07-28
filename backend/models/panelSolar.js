const db = require('../models/db');


module.exports = {

    findAll: async() => {
                const [rows] = await db.query('SELECT * FROM panel_solar')
                return rows;
    },

    // buscar por id
    findById : async (id) => {
        const [rows] = await db.query('SELECT * FROM panel_solar WHERE id = ?', [id]);
        return rows[0]; // Retorna el primer panel solar encontrado
    },

    // obtener  a energia generada por un panel solar
    getEnergiaGenerada: async (id) => {
        const [rows] = await db.query('SELECT energia_generada FROM panel_solar WHERE id = ?', [id]);
        return rows[0] ? rows[0].energia_generada : null; // Retorna la energia generada del panel solar
    },

};



