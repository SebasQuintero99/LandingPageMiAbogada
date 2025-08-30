const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMonthInfo } = require('../services/googleCalendarService');

// Obtener información del mes usando Google Calendar API
router.get('/month-info/:year/:month', authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Validar parámetros
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        error: 'Año y mes deben ser números válidos. Mes debe estar entre 1-12.'
      });
    }
    
    const monthInfo = await getMonthInfo(yearNum, monthNum);
    
    res.json({
      success: true,
      data: monthInfo
    });
    
  } catch (error) {
    console.error('Error en endpoint month-info:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Placeholder para futuras funciones de horario
router.get('/', (req, res) => {
  res.json({ message: 'Schedule endpoint - En desarrollo' });
});

module.exports = router;