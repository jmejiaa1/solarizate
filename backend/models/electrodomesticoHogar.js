const db = require('../models/db');



module.exports = {

    // crear electrodomésticoHogar
    create: async (electrodomesticoHogar) => {
        const { fk_electrodomestico, fk_hogar } = electrodomesticoHogar;
        const [result] = await db.query('INSERT INTO electrodomestico_hogar (fk_electrodomestico, fk_hogar) VALUES (?, ?)', [fk_electrodomestico, fk_hogar]);
        return { id: result.insertId, ...electrodomesticoHogar };
    }
}