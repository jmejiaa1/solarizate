const Panel = require('../models/panelSolar');

// Obtener todos los paneles solares
exports.getAll = async (req, res) => {
    try {
        console.log('Solicitud GET a /api/panelesSolares');
        const paneles = await Panel.findAll();
        console.log(`Paneles solares encontrados: ${paneles.length}`);
        res.json(paneles);
    } catch (err) {
        console.error('Error al obtener paneles solares:', err);
        res.status(500).json({ error: 'Error al obtener los paneles solares' });
    }
};

// Obtener panel solar por ID
exports.getById = async (req, res) => {
   try {
     console.log(`Solicitud GET a /api/panelesSolares/${req.params.id}`);
     const panel = await Panel.findById(req.params.id);
     if (panel) {
       res.json(panel);
     } else {
       res.status(404).json({ error: 'Panel solar no encontrado' });
     }
   } catch (err) {
     console.error('Error al buscar panel solar:', err);
     res.status(500).json({ error: 'Error al buscar el panel solar' });
   }
};

   // Obtener la energía generada por un panel solar
exports.getEnergiaGenerada = async (req, res) => {
    try {
        const energia = await Panel.getEnergiaGenerada(req.params.id);
        if (energia === null) {
            return res.status(404).json({ error: 'Panel solar no encontrado' });
        }
        res.json({ energia_generada: energia });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la energía generada' });
    }
};