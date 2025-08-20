const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  verifyToken
} = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', authMiddleware, getProfile);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;