
const express = require('express');
const cors = require('cors');
const db = require('./models/db');
const app = express();

// Configuración de middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Logging middleware simple para debug
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`\n📝 ${req.method} ${req.path}`);
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Ruta de prueba para verificar conexión
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para verificar la base de datos
app.get('/api/test/db', async (req, res) => {
  try {
    // Probar conexión a la base de datos
    const [rows] = await db.query('SELECT 1 as test');
    
    // Obtener conteo de tablas
    const [regiones] = await db.query('SELECT COUNT(*) as count FROM region');
    const [paneles] = await db.query('SELECT COUNT(*) as count FROM panel_solar');
    const [electrodomesticos] = await db.query('SELECT COUNT(*) as count FROM electrodomestico');
    const [hogares] = await db.query('SELECT COUNT(*) as count FROM hogar');
    
    res.json({
      database: 'Conectado correctamente',
      tables: {
        regiones: regiones[0].count,
        paneles_solares: paneles[0].count,
        electrodomesticos: electrodomesticos[0].count,
        hogares: hogares[0].count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error de base de datos:', error);
    res.status(500).json({
      error: 'Error de conexión a la base de datos',
      details: error.message
    });
  }
});

// Rutas de la API
const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

const regionesRouter = require('./routes/regiones');
app.use('/api/regiones', regionesRouter);

const panelesRouter = require('./routes/panelSolar');
app.use('/api/panelesSolares', panelesRouter);

const electrodomesticosRouter = require('./routes/electrodomesticos');
app.use('/api/electrodomesticos', electrodomesticosRouter);

const instalacionesRouter = require('./routes/instalaciones');
app.use('/api/instalaciones', instalacionesRouter);

const eHogarRouter = require('./routes/eHogares');
app.use('/api/eHogar', eHogarRouter);

const hogarRouter = require('./routes/hogares');
app.use('/api/hogares', hogarRouter);

// Middleware para rutas no encontradas (debe ir después de todas las rutas)
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores 500
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`URLs disponibles:`);
  console.log(`- Test: http://localhost:${PORT}/api/test`);
  console.log(`- Usuarios: http://localhost:${PORT}/api/usuarios`);
  console.log(`- Regiones: http://localhost:${PORT}/api/regiones`);
  console.log(`- Paneles: http://localhost:${PORT}/api/panelesSolares`);
  console.log(`- Electrodomésticos: http://localhost:${PORT}/api/electrodomesticos`);
  console.log(`- Hogares: http://localhost:${PORT}/api/hogares`);
});


