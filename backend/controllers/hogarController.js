const Hogar = require('../models/hogar');
const Instalacion = require('../models/instalacion');
const ElectrodomesticoHogar = require('../models/electrodomesticoHogar');

// Obtener todos los hogares
exports.getAll = async (req, res) => {
    try {
        const hogares = await Hogar.findAll();
        res.json(hogares);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los hogares' });
    }
};

// Obtener hogar por ID
exports.getById = async (req, res) => {
    try {
        const hogar = await Hogar.findById(req.params.id);
        if (hogar) {
            res.json(hogar);
        } else {
            res.status(404).json({ error: 'Hogar no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el hogar' });
    }
};

// Crear nuevo hogar con paneles e instalaciones
exports.create = async (req, res) => {
    try {
        console.log('\n=== CREANDO HOGAR ===');
        console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
        
        const { paneles, electrodomesticos, ...hogarData } = req.body;
        
        // Verificar que tenemos los datos mínimos requeridos
        if (!hogarData.direccion || !hogarData.ciudad || !hogarData.fk_region || !hogarData.fk_usuario) {
            console.error('❌ Faltan datos requeridos:', hogarData);
            return res.status(400).json({ 
                error: 'Faltan campos requeridos: direccion, ciudad, fk_region, fk_usuario',
                datosRecibidos: hogarData
            });
        }
        
        // Crear el hogar primero
        const nuevoHogar = await Hogar.create(hogarData);
        
        // Si hay paneles, crear las instalaciones
        if (paneles && paneles.length > 0) {
            console.log('Creando instalaciones de paneles...');
            for (const panel of paneles) {
                console.log('Creando instalación para panel:', panel);
                await Instalacion.createInstalacion({
                    cantidad_panel: panel.cantidad,
                    generacion_estimada: panel.energia_generada * panel.cantidad,
                    fk_panel_solar: panel.panel_id,
                    fk_hogar: nuevoHogar.id
                });
            }
        }
        
        // Si hay electrodomésticos, crear las relaciones
        if (electrodomesticos && electrodomesticos.length > 0) {
            console.log('Creando relaciones de electrodomésticos...');
            for (const electro of electrodomesticos) {
                console.log('Creando relación para electrodoméstico:', electro);
                for (let i = 0; i < electro.cantidad; i++) {
                    await ElectrodomesticoHogar.create({
                        fk_electrodomestico: electro.electrodomestico_id,
                        fk_hogar: nuevoHogar.id
                    });
                }
            }
        }
        
        console.log('Hogar creado completamente con todas las relaciones');
        res.status(201).json(nuevoHogar);
    } catch (err) {
        console.error('=== ERROR AL CREAR EL HOGAR ===');
        console.error('Error completo:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ 
            error: 'Error al crear el hogar',
            details: err.message 
        });
    }
};

// Obtener hogares por usuario
exports.getByUsuario = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Buscando hogares para usuario ID: ${userId}`);
        
        const hogares = await Hogar.findAll();
        console.log(`Total de hogares encontrados: ${hogares.length}`);
        
        const hogaresUsuario = hogares.filter(hogar => hogar.fk_usuario == userId);
        console.log(`Hogares del usuario ${userId}: ${hogaresUsuario.length}`);
        
        // Siempre devolver un array, incluso si está vacío
        res.json(hogaresUsuario || []);
    } catch (err) {
        console.error('Error al obtener hogares del usuario:', err);
        res.status(500).json({ 
            error: 'Error al obtener los hogares del usuario',
            hogares: [] // Devolver array vacío en caso de error
        });
    }
};

// Actualizar hogar
exports.update = async (req, res) => {
    try {
        const hogarActualizado = await Hogar.update(req.params.id, req.body);
        res.json(hogarActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el hogar' });
    }
};

// Eliminar hogar
exports.delete = async (req, res) => {
    try {
        await Hogar.delete(req.params.id);
        res.json({ message: 'Hogar eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el hogar' });
    }
};