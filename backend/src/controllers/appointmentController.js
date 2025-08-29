const prisma = require('../utils/database');
const { createAppointmentSchema, getActiveConsultationTypes } = require('../utils/validation');
const emailService = require('../services/emailService');

// Crear nueva cita
const createAppointment = async (req, res) => {
  try {
    // Crear esquema dinámico basado en configuración actual
    const dynamicSchema = await createAppointmentSchema();
    
    // Validar datos de entrada con esquema dinámico
    const validatedData = dynamicSchema.parse(req.body);
    
    // Verificar que el tipo de consulta esté activo
    const activeTypes = await getActiveConsultationTypes();
    if (!activeTypes.includes(validatedData.consultationType)) {
      return res.status(400).json({
        error: 'Tipo de consulta no disponible actualmente'
      });
    }
    
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
      success: true,
      data: {
        appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
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
    
    // Obtener configuración de horarios desde la base de datos
    let scheduleConfig = await prisma.setting.findFirst({
      where: { key: 'schedule' }
    });

    // Si no existe la configuración, crear con valores por defecto
    if (!scheduleConfig) {
      const defaultSchedule = {
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '17:00',
        lunchStart: '12:00',
        lunchEnd: '14:00',
        appointmentDuration: 60
      };
      
      scheduleConfig = await prisma.setting.create({
        data: {
          key: 'schedule',
          value: JSON.stringify(defaultSchedule)
        }
      });
    }

    const schedule = JSON.parse(scheduleConfig.value);
    
    const workDays = schedule.workDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const startTime = schedule.startTime || '09:00';
    const endTime = schedule.endTime || '17:00';
    const lunchStart = schedule.lunchStart || '12:00';
    const lunchEnd = schedule.lunchEnd || '14:00';
    const appointmentDuration = parseInt(schedule.appointmentDuration) || 60;

    // Generar horarios disponibles basados en configuración
    const generateTimeSlots = () => {
      const slots = [];
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const lunchStartTime = new Date(`2000-01-01T${lunchStart}:00`);
      const lunchEndTime = new Date(`2000-01-01T${lunchEnd}:00`);
      
      const current = new Date(start);
      while (current < end) {
        const timeString = current.toTimeString().substring(0, 5);
        
        // Evitar horarios de almuerzo
        if (current < lunchStartTime || current >= lunchEndTime) {
          slots.push(timeString);
        }
        
        current.setMinutes(current.getMinutes() + appointmentDuration);
      }
      return slots;
    };

    const availableHours = generateTimeSlots();

    // Mapeo de días de semana
    const dayMap = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };

    // Obtener fechas disponibles específicas del calendario
    const configuredDates = schedule.availableDates || [];

    for (let i = 0; i <= parseInt(days); i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Evitar problemas de timezone usando formato local
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // Solo usar fechas específicamente marcadas como disponibles en el calendario
      const isDayAvailable = configuredDates.includes(dateString);
      
      if (isDayAvailable) {
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
        const availableSlots = availableHours.filter(hour => !occupiedHours.includes(hour));

        if (availableSlots.length > 0) {
          availableDates.push({
            date: date.toISOString().split('T')[0],
            availableHours: availableSlots
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