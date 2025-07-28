const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/', regionController.getAll);
router.get('/:id', regionController.getById);

module.exports = router;