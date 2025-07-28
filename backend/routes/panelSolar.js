const express = require('express');
const router = express.Router();
const panelSolarController = require('../controllers/panelSolarController');

router.get('/', panelSolarController.getAll);
router.get('/energia/:id', panelSolarController.getEnergiaGenerada);
router.get('/:id', panelSolarController.getById);

module.exports = router;