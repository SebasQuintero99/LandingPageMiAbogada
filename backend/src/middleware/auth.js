const jwt = require('jsonwebtoken');
const prisma = require('../utils/database');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Acceso denegado. Token requerido.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    console.error('Error en autenticación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar rol admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Acceso denegado. Se requieren permisos de administrador.'
      });
    }
    next();
  } catch (error) {
    console.error('Error en verificación de admin:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;