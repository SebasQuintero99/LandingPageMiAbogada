const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuración por defecto de tipos de consulta
const DEFAULT_CONSULTATION_TYPES = [
  'Derecho Laboral',
  'Seguridad Social', 
  'Despido Injustificado',
  'Pensiones',
  'Accidentes Laborales'
];

// Función para obtener tipos de consulta activos desde la configuración
const getActiveConsultationTypes = async () => {
  try {
    const config = await prisma.setting.findFirst({
      where: { key: 'consultations' }
    });

    if (config) {
      const consultations = JSON.parse(config.value);
      return consultations
        .filter(consultation => consultation.active)
        .map(consultation => consultation.name);
    }
    
    return DEFAULT_CONSULTATION_TYPES;
  } catch (error) {
    console.error('Error loading consultation types for validation:', error);
    return DEFAULT_CONSULTATION_TYPES;
  }
};

// Función para crear schema de appointment dinámicamente
const createAppointmentSchema = async () => {
  const consultationTypes = await getActiveConsultationTypes();
  
  return z.object({
    date: z.string().datetime(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    consultationType: z.enum(consultationTypes, {
      errorMap: () => ({ message: 'Tipo de consulta inválido' })
    }),
    clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    clientEmail: z.string().email('Email inválido'),
    clientPhone: z.string().length(10, 'El teléfono debe tener exactamente 10 dígitos').regex(/^\d{10}$/, 'El teléfono solo debe contener números'),
    message: z.string().optional()
  });
};

// Schema estático para retrocompatibilidad (fallback)
const appointmentSchema = z.object({
  date: z.string().datetime(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  consultationType: z.string().min(1, 'Tipo de consulta es requerido'),
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().length(10, 'El teléfono debe tener exactamente 10 dígitos').regex(/^\d{10}$/, 'El teléfono solo debe contener números'),
  message: z.string().optional()
});

// Contact validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').max(15).optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000)
});

// User registration schema
const userRegistrationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// User login schema
const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'La contraseña es requerida')
});

module.exports = {
  appointmentSchema,
  createAppointmentSchema,
  getActiveConsultationTypes,
  contactSchema,
  userRegistrationSchema,
  userLoginSchema
};