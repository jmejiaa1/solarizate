const db = require('../models/db');


module.exports = {


    findAll: async() => {
            const [rows] = await db.query('SELECT * FROM region')
            return rows;
        },

    // buscar por id
     findById : async (id) => {
            const [rows] = await db.query('SELECT * FROM region WHERE id = ?', [id]);
            return rows[0]; // Retorna la primera region encontrada
    
        },

};