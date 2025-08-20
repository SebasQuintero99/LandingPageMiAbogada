const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus,
  getContactById
} = require('../controllers/contactController');

// Middleware de autenticación (solo para rutas admin)
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/', createContact);

// Rutas protegidas (admin)
router.get('/', authMiddleware, getContacts);
router.get('/:id', authMiddleware, getContactById);
router.patch('/:id/status', authMiddleware, updateContactStatus);

module.exports = router;