const Region = require('../models/region');

// Obtener todas las regiones
exports.getAll = async (req, res) => {
    try {
        console.log('Solicitud GET a /api/regiones');
        const region = await Region.findAll();
        console.log(`Regiones encontradas: ${region.length}`);
        res.json(region);
    } catch (err) {
        console.error('Error al obtener regiones:', err);
        res.status(500).json({ error: 'Error al obtener las regiones' });
    }
};

// Obtener todas las regiones por ID
exports.getById = async (req, res) => {
   try {
     console.log(`Solicitud GET a /api/regiones/${req.params.id}`);
     const region = await Region.findById(req.params.id);
     if (region) {
       res.json(region);
     } else {
       res.status(404).json({ error: 'Región no encontrada' });
     }
   } catch (err) {
     console.error('Error al buscar región:', err);
     res.status(500).json({ error: 'Error al buscar la región' });
   }
};