const Ehogar = require('../models/electrodomesticoHogar');


// Crear un nuevo electrodoméstico en el hogar
exports.create = async (req, res) => {
    try {
        const nuevoEhogar = await Ehogar.create(req.body);
        res.status(201).json(nuevoEhogar);
    } catch (error) {
        console.error('Error al crear electrodoméstico en el hogar:', error);
        res.status(500).json({ error: 'Error al crear electrodoméstico en el hogar' });
    }
};
