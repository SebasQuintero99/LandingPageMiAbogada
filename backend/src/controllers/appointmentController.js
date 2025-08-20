const prisma = require('../utils/database');
const { appointmentSchema } = require('../utils/validation');
const emailService = require('../services/emailService');

// Crear nueva cita
const createAppointment = async (req, res) => {
  try {
    // Validar datos de entrada
    const validatedData = appointmentSchema.parse(req.body);
    
    // Verificar disponibilidad de fecha y hora
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: new Date(validatedData.date),
        time: validatedData.time,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingAppointment) {
      return res.status(409).json({
        error: 'La fecha y hora seleccionada ya está ocupada'
      });
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(validatedData.date),
        time: validatedData.time,
        consultationType: validatedData.consultationType,
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        message: validatedData.message || null
      }
    });

    // Enviar email de confirmación
    try {
      await emailService.sendAppointmentConfirmation(appointment);
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar la cita si el email falla
    }

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        consultationType: appointment.consultationType,
        status: appointment.status
      }
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      });
    }
    
    console.error('Error creando cita:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener citas (para admin)
const getAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (date) {
      const searchDate = new Date(date);
      where.date = {
        gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.appointment.count({ where });

    res.json({
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de cita
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({
        error: 'Estado inválido'
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });

    // Enviar email de actualización si es confirmación o cancelación
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      try {
        await emailService.sendAppointmentStatusUpdate(appointment, status);
      } catch (emailError) {
        console.error('Error enviando email de actualización:', emailError);
      }
    }

    res.json({
      message: 'Estado de cita actualizado',
      appointment
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Cita no encontrada'
      });
    }
    
    console.error('Error actualizando cita:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener fechas disponibles
const getAvailableDates = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const availableDates = [];
    const today = new Date();
    
    // Horarios disponibles por defecto
    const defaultHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    for (let i = 1; i <= parseInt(days); i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Solo días de semana (lunes a viernes)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Obtener citas existentes para esta fecha
        const existingAppointments = await prisma.appointment.findMany({
          where: {
            date: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lt: new Date(date.setHours(23, 59, 59, 999))
            },
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          },
          select: { time: true }
        });

        const occupiedHours = existingAppointments.map(apt => apt.time);
        const availableHours = defaultHours.filter(hour => !occupiedHours.includes(hour));

        if (availableHours.length > 0) {
          availableDates.push({
            date: date.toISOString().split('T')[0],
            availableHours
          });
        }
      }
    }

    res.json({ availableDates });

  } catch (error) {
    console.error('Error obteniendo fechas disponibles:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAvailableDates
};