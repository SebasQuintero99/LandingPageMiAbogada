const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Configuración por defecto
const DEFAULT_CONFIG = {
  business: {
    name: 'Dra. Angy Tatiana Garzón Fierro',
    email: 'angytatianagarzonfierrolaboral@gmail.com',
    phone: '+573177154643',
    address: '',
    website: '',
    description: 'Servicios legales especializados en derecho laboral y seguridad social'
  },
  schedule: {
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '09:00',
    endTime: '17:00',
    lunchStart: '12:00',
    lunchEnd: '14:00',
    appointmentDuration: 60
  },
  consultations: [
    { id: 1, name: 'Derecho Laboral', description: 'Consultas relacionadas con temas laborales', active: true },
    { id: 2, name: 'Seguridad Social', description: 'Pensiones y seguridad social', active: true },
    { id: 3, name: 'Despido Injustificado', description: 'Casos de despidos improcedentes', active: true },
    { id: 4, name: 'Pensiones', description: 'Trámites y consultas sobre pensiones', active: true },
    { id: 5, name: 'Accidentes Laborales', description: 'Casos de accidentes de trabajo', active: true }
  ],
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    reminderHours: 24,
    adminEmail: 'admin@miabogada.com',
    notifyNewAppointments: true,
    notifyNewContacts: true
  }
};

// Obtener configuración del negocio (público)
router.get('/business/public', async (req, res) => {
  try {
    // Obtener configuración de la base de datos
    let config = await prisma.setting.findFirst({
      where: { key: 'business' }
    });

    let businessData;
    if (config) {
      // Si existe configuración en la BD, usarla
      businessData = JSON.parse(config.value);
    } else {
      // Si no existe, usar la configuración por defecto
      businessData = DEFAULT_CONFIG.business;
    }
    
    res.json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Error loading public business settings:', error);
    res.json({
      success: true,
      data: DEFAULT_CONFIG.business
    });
  }
});

// Obtener configuración del negocio (admin)
router.get('/business', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Intentar obtener configuración de la base de datos
    let config = await prisma.setting.findFirst({
      where: { key: 'business' }
    });

    if (!config) {
      // Si no existe, crear con valores por defecto
      config = await prisma.setting.create({
        data: {
          key: 'business',
          value: JSON.stringify(DEFAULT_CONFIG.business)
        }
      });
    }

    res.json({
      success: true,
      data: JSON.parse(config.value)
    });
  } catch (error) {
    console.error('Error loading business settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar la configuración del negocio'
    });
  }
});

// Actualizar configuración del negocio
router.put('/business', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const businessConfig = req.body;

    await prisma.setting.upsert({
      where: { key: 'business' },
      update: {
        value: JSON.stringify(businessConfig)
      },
      create: {
        key: 'business',
        value: JSON.stringify(businessConfig)
      }
    });

    res.json({
      success: true,
      message: 'Configuración del negocio actualizada correctamente'
    });
  } catch (error) {
    console.error('Error saving business settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar la configuración del negocio'
    });
  }
});

// Obtener configuración de horarios
router.get('/schedule', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let config = await prisma.setting.findFirst({
      where: { key: 'schedule' }
    });

    if (!config) {
      config = await prisma.setting.create({
        data: {
          key: 'schedule',
          value: JSON.stringify(DEFAULT_CONFIG.schedule)
        }
      });
    }

    res.json({
      success: true,
      data: JSON.parse(config.value)
    });
  } catch (error) {
    console.error('Error loading schedule settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar la configuración de horarios'
    });
  }
});

// Actualizar configuración de horarios
router.put('/schedule', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const scheduleConfig = req.body;

    await prisma.setting.upsert({
      where: { key: 'schedule' },
      update: {
        value: JSON.stringify(scheduleConfig)
      },
      create: {
        key: 'schedule',
        value: JSON.stringify(scheduleConfig)
      }
    });

    res.json({
      success: true,
      message: 'Configuración de horarios actualizada correctamente'
    });
  } catch (error) {
    console.error('Error saving schedule settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar la configuración de horarios'
    });
  }
});

// Obtener tipos de consulta (público)
router.get('/consultations/public', async (req, res) => {
  try {
    let config = await prisma.setting.findFirst({
      where: { key: 'consultations' }
    });

    if (!config) {
      config = await prisma.setting.create({
        data: {
          key: 'consultations',
          value: JSON.stringify(DEFAULT_CONFIG.consultations)
        }
      });
    }

    const consultations = JSON.parse(config.value);
    // Filtrar solo las consultas activas y devolver solo los nombres
    const activeConsultationNames = consultations
      .filter(consultation => consultation.active)
      .map(consultation => consultation.name);

    res.json({
      success: true,
      data: activeConsultationNames
    });
  } catch (error) {
    console.error('Error loading public consultation types:', error);
    res.json({
      success: true,
      data: DEFAULT_CONFIG.consultations
        .filter(consultation => consultation.active)
        .map(consultation => consultation.name)
    });
  }
});

// Obtener tipos de consulta (admin)
router.get('/consultations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let config = await prisma.setting.findFirst({
      where: { key: 'consultations' }
    });

    if (!config) {
      config = await prisma.setting.create({
        data: {
          key: 'consultations',
          value: JSON.stringify(DEFAULT_CONFIG.consultations)
        }
      });
    }

    res.json({
      success: true,
      data: JSON.parse(config.value)
    });
  } catch (error) {
    console.error('Error loading consultation types:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar los tipos de consulta'
    });
  }
});

// Actualizar tipos de consulta
router.put('/consultations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const consultations = req.body;

    await prisma.setting.upsert({
      where: { key: 'consultations' },
      update: {
        value: JSON.stringify(consultations)
      },
      create: {
        key: 'consultations',
        value: JSON.stringify(consultations)
      }
    });

    res.json({
      success: true,
      message: 'Tipos de consulta actualizados correctamente'
    });
  } catch (error) {
    console.error('Error saving consultation types:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar los tipos de consulta'
    });
  }
});

// Obtener configuración de notificaciones
router.get('/notifications', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let config = await prisma.setting.findFirst({
      where: { key: 'notifications' }
    });

    if (!config) {
      config = await prisma.setting.create({
        data: {
          key: 'notifications',
          value: JSON.stringify(DEFAULT_CONFIG.notifications)
        }
      });
    }

    res.json({
      success: true,
      data: JSON.parse(config.value)
    });
  } catch (error) {
    console.error('Error loading notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar la configuración de notificaciones'
    });
  }
});

// Actualizar configuración de notificaciones
router.put('/notifications', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const notificationConfig = req.body;

    await prisma.setting.upsert({
      where: { key: 'notifications' },
      update: {
        value: JSON.stringify(notificationConfig)
      },
      create: {
        key: 'notifications',
        value: JSON.stringify(notificationConfig)
      }
    });

    res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada correctamente'
    });
  } catch (error) {
    console.error('Error saving notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar la configuración de notificaciones'
    });
  }
});

// Obtener usuarios del sistema
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar los usuarios'
    });
  }
});

// Crear nuevo usuario
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: 'temp123' // Contraseña temporal
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: 'Usuario creado correctamente'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario'
    });
  }
});

// Eliminar usuario
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar al usuario actual
    if (req.user.userId === id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminarte a ti mismo'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario'
    });
  }
});

// Endpoint para backup (simulado)
router.get('/backup', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // En un caso real, aquí generarías un backup completo
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        appointments: await prisma.appointment.count(),
        contacts: await prisma.contact.count(),
        users: await prisma.user.count(),
        settings: await prisma.setting.count()
      }
    };

    res.json({
      success: true,
      data: backupData
    });
  } catch (error) {
    console.error('Error generating backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el backup'
    });
  }
});

module.exports = router;