const { z } = require('zod');

// Appointment validation schema
const appointmentSchema = z.object({
  date: z.string().datetime(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  consultationType: z.enum([
    'Consulta General',
    'Derecho Laboral', 
    'Seguridad Social',
    'Despido Injustificado',
    'Pensiones',
    'Accidente Laboral'
  ]),
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').max(15),
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
  contactSchema,
  userRegistrationSchema,
  userLoginSchema
};