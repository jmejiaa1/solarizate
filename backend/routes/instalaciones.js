const express = require('express');
const router = express.Router();
const instalacionController = require('../controllers/instalacionController');


router.get('/', (req, res) => {
  res.json({ mensaje: 'instalaciones funcionando' });
});

router.get('/', instalacionController.getAll);
router.get('/:id', instalacionController.getById);
router.post('/', instalacionController.create);
router.put('/:id', instalacionController.update);
router.delete('/:id', instalacionController.remove);

module.exports = router;