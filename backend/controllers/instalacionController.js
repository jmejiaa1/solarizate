const Instalacion = require('../models/instalacion');


// Obtener todas las instalaciones
exports.getAll = async (req, res) => {
    try {
        const instalaciones = await Instalacion.findAll();
        res.json(instalaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las instalaciones' });
    }
}

// Obtener una instalación por ID
exports.getById = async (req, res) => { 
    try {
      const instalacion = await Instalacion.findById(req.params.id);
      if (!instalacion) return res.status(404).json({ error: 'Instalación no encontrada' });
      res.json(instalacion);
    } catch (err) {
      res.status(500).json({ error: 'Error al buscar la instalación' });
    }
    }
// Crear una nueva instalación
exports.create = async (req, res) => {
    try {
        const nuevaInstalacion = await Instalacion.create(req.body);
        res.status(201).json(nuevaInstalacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la instalación' });
    }
}

// Actualizar una instalación
exports.update = async (req, res) => {
    try {
        const instalacionActualizada = await Instalacion.update(req.params.id, req.body);
        res.json(instalacionActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la instalación' });
    }
}

// Eliminar una instalación
exports.remove = async (req, res) => {
    try {
        await Instalacion.remove(req.params.id);
        res.json({ message: 'Instalación eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la instalación' });
    }
}

