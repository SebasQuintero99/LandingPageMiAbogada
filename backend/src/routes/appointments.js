const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAvailableDates
} = require('../controllers/appointmentController');

// Middleware de autenticación (solo para rutas admin)
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/', createAppointment);
router.get('/available-dates', getAvailableDates);

// Rutas protegidas (admin)
router.get('/admin', authMiddleware, getAppointments);
router.patch('/:id/status', authMiddleware, updateAppointmentStatus);

module.exports = router;