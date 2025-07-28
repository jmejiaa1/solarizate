const express = require('express');
const router = express.Router();
const hogarController = require('../controllers/hogarController');

router.get('/', hogarController.getAll);
router.get('/usuario/:userId', hogarController.getByUsuario);
router.get('/:id', hogarController.getById);
router.post('/', hogarController.create);
router.put('/:id', hogarController.update);
router.delete('/:id', hogarController.delete);

module.exports = router;
