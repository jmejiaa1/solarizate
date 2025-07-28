// Configuración de conexión a MySQL
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost', // servidor de la base de datos
  user: 'root', //usuario
  password: 'usbw', //contraseña
  database: 'solarizate', //base de datos
  waitForConnections: true, // esperar conexiones si el pool está ocupado
  connectionLimit: 10, // número máximo de conexiones en el pool
  queueLimit: 0, // sin límite de cola
  port: 3307 // puerto por defecto de MySQL
});

module.exports = pool.promise();

