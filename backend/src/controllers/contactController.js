const prisma = require('../utils/database');
const { contactSchema } = require('../utils/validation');
const emailService = require('../services/emailService');

// Crear nuevo contacto
const createContact = async (req, res) => {
  try {
    // Validar datos de entrada
    const validatedData = contactSchema.parse(req.body);
    
    // Crear el contacto
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message
      }
    });

    // Enviar email de notificación a la abogada
    try {
      await emailService.sendContactNotification(contact);
    } catch (emailError) {
      console.error('Error enviando email de contacto:', emailError);
      // No fallar el contacto si el email falla
    }

    // Enviar email de confirmación al cliente
    try {
      await emailService.sendContactConfirmation(contact);
    } catch (emailError) {
      console.error('Error enviando confirmación al cliente:', emailError);
    }

    res.status(201).json({
      message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
      contact: {
        id: contact.id,
        name: contact.name,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      });
    }
    
    console.error('Error creando contacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener contactos (para admin)
const getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.contact.count({ where });

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de contacto
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'REVIEWED', 'RESPONDED'].includes(status)) {
      return res.status(400).json({
        error: 'Estado inválido'
      });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Estado de contacto actualizado',
      contact
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Contacto no encontrado'
      });
    }
    
    console.error('Error actualizando contacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener contacto por ID
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        error: 'Contacto no encontrado'
      });
    }

    res.json({ contact });

  } catch (error) {
    console.error('Error obteniendo contacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
  getContactById
};