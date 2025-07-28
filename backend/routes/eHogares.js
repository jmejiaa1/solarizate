const express = require('express');
const router = express.Router();
const eHogarContoller = require('../controllers/eHogarController');



router.get('/', (req, res) => {
  res.json({ mensaje: 'eHogar funcionando' });
});

router.post('/', eHogarContoller.create);

module.exports = router;