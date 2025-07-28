
const Usuario = require('../models/usuario');



exports.getById = async (req, res) => {
   try {
     const usuario = await Usuario.findById(req.params.id);
     res.json(usuario);
   } catch (err) {
     res.status(500).json({ error: 'Error al buscar el usuario' });
   }
};


exports.create = async (req, res) => {
    try {
        const nuevo = await Usuario.create(req.body);
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};


exports.update = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Actualiza campos si vienen
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    if (nombre) usuario.nombre = nombre;

    const actualizado = await usuario.save();
    res.json(actualizado);

  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};





exports.remove = async (req, res) => {
        try {
            await Usuario.remove(req.params.id);
            res.json({ message: 'Usuario eliminado' });
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }

},


exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        // Buscar usuario por email
        const usuario = await Usuario.findByEmail(correo);
        
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña (en un sistema real deberías usar hash)
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Login exitoso - retornar datos del usuario (sin la contraseña)
        const { contrasena: _, ...usuarioSeguro } = usuario;
        res.json({ 
            message: 'Login exitoso',
            currentUser: usuarioSeguro  // Cambiar de 'usuario' a 'currentUser'
        });

    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};