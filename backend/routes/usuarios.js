const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', (req, res) => {
  res.json({ mensaje: 'Usuarios funcionando' });
});

router.post('/login', usuarioController.login);
router.get('/:id', usuarioController.getById);
router.post('/', usuarioController.create);
router.put ('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;






