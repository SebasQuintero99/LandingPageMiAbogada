const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder para futuras funciones de horario
router.get('/', (req, res) => {
  res.json({ message: 'Schedule endpoint - En desarrollo' });
});

module.exports = router;