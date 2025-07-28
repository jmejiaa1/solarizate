const db = require('../models/db');


module.exports = {
  getAllInstalaciones,
  getInstalacionById,
  createInstalacion,
  updateInstalacion,
  deleteInstalacion
};

async function getAllInstalaciones() {
  const [rows] = await db.query('SELECT * FROM instalacion');
  return rows;
}
async function getInstalacionById(id) {
  const [rows] = await db.query('SELECT * FROM instalacion WHERE id = ?', [id]);
  return rows[0]; // Retorna la primera instalación encontrada
}
async function createInstalacion(instalacion) {
    const { cantidad_panel, generacion_estimada, fk_panel_solar, fk_hogar } = instalacion;
    const [result] = await db.query(
        'INSERT INTO instalacion (cantidad_panel, generacion_estimada, fk_panel_solar, fk_hogar) VALUES (?, ?, ?, ?)',
        [cantidad_panel, generacion_estimada, fk_panel_solar, fk_hogar]
    );
    return { id: result.insertId, ...instalacion };
}

async function updateInstalacion(id, instalacion) {
    const { cantidad_panel } = instalacion;
    await db.query(
        'UPDATE instalacion SET cantidad_panel = ? WHERE id = ?',
        [cantidad_panel, id]
    );
    return { id, ...instalacion };
  
}

async function deleteInstalacion(id) {
    await db.query('DELETE FROM instalacion WHERE id = ?', [id]);
    return { message: 'Instalación eliminada correctamente' };
}