const express = require('express');
const router = express.Router();
const electrodomesticoController = require('../controllers/electrodomesticoController');

router.get('/', electrodomesticoController.getAll);
router.get('/consumo/:id', electrodomesticoController.getConsumo);
router.get('/:id', electrodomesticoController.getById);

module.exports = router;