const Electrodomestico = require('../models/electrodomestico');

// Obtener todos los electrodomésticos
exports.getAll = async (req, res) => {
    try {
        console.log('Solicitud GET a /api/electrodomesticos');
        const electrodomesticos = await Electrodomestico.findAll();
        console.log(`Electrodomésticos encontrados: ${electrodomesticos.length}`);
        res.json(electrodomesticos);
    } catch (err) {
        console.error('Error al obtener electrodomésticos:', err);
        res.status(500).json({ error: 'Error al obtener los electrodomésticos' });
    }
};

// Obtener electrodoméstico por ID
exports.getById = async (req, res) => {
   try {
     console.log(`Solicitud GET a /api/electrodomesticos/${req.params.id}`);
     const electrodomestico = await Electrodomestico.findById(req.params.id);
     if (electrodomestico) {
       res.json(electrodomestico);
     } else {
       res.status(404).json({ error: 'Electrodoméstico no encontrado' });
     }
   } catch (err) {
     console.error('Error al buscar electrodoméstico:', err);
     res.status(500).json({ error: 'Error al buscar el electrodoméstico' });
   }
};

// Obtener el consumo de un electrodoméstico
exports.getConsumo = async (req, res) => {
    try {
        const consumo = await Electrodomestico.getConsumo(req.params.id);
        if (consumo === null) {
            return res.status(404).json({ error: 'Electrodoméstico no encontrado' });
        }
        res.json({ consumo: consumo });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el consumo' });
    }
};