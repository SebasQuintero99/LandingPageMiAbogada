const nodemailer = require('nodemailer');

// Configurar transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Enviar confirmación de cita al cliente
const sendAppointmentConfirmation = async (appointment) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: appointment.clientEmail,
    subject: 'Confirmación de Cita - Dra. Angy Tatiana Garzón Fierro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #66102B, #8B1538); color: white; padding: 20px; text-align: center;">
          <h1>Confirmación de Cita</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hola ${appointment.clientName},</h2>
          
          <p>Tu cita ha sido <strong>recibida correctamente</strong>. Te contactaremos pronto para confirmar la disponibilidad.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #66102B; margin-top: 0;">Detalles de la Cita:</h3>
            <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Hora:</strong> ${appointment.time}</p>
            <p><strong>Tipo de consulta:</strong> ${appointment.consultationType}</p>
            ${appointment.message ? `<p><strong>Mensaje:</strong> ${appointment.message}</p>` : ''}
          </div>
          
          <p>Si necesitas cambiar o cancelar tu cita, puedes contactarnos:</p>
          <ul>
            <li><strong>Teléfono:</strong> ${process.env.BUSINESS_PHONE}</li>
            <li><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</li>
          </ul>
          
          <p style="margin-top: 30px;">Saludos cordiales,<br><strong>${process.env.BUSINESS_NAME}</strong></p>
        </div>
        
        <div style="background: #66102B; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© 2024 ${process.env.BUSINESS_NAME}. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Notificar a la abogada sobre nueva cita
const sendAppointmentNotification = async (appointment) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.BUSINESS_EMAIL,
    subject: 'Nueva Cita Agendada - Sistema de Citas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #66102B; color: white; padding: 20px;">
          <h1>Nueva Cita Agendada</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Detalles del Cliente:</h2>
          <p><strong>Nombre:</strong> ${appointment.clientName}</p>
          <p><strong>Email:</strong> ${appointment.clientEmail}</p>
          <p><strong>Teléfono:</strong> ${appointment.clientPhone}</p>
          
          <h2>Detalles de la Cita:</h2>
          <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString('es-CO')}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
          <p><strong>Tipo de consulta:</strong> ${appointment.consultationType}</p>
          ${appointment.message ? `<p><strong>Mensaje:</strong> ${appointment.message}</p>` : ''}
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/admin" style="background: #66102B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver en Panel Admin
            </a>
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Enviar actualización de estado de cita
const sendAppointmentStatusUpdate = async (appointment, status) => {
  const transporter = createTransporter();
  
  const statusMessages = {
    CONFIRMED: 'confirmada',
    CANCELLED: 'cancelada',
    COMPLETED: 'completada'
  };

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: appointment.clientEmail,
    subject: `Cita ${statusMessages[status]} - ${process.env.BUSINESS_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${status === 'CANCELLED' ? '#dc2626' : '#66102B'}; color: white; padding: 20px; text-align: center;">
          <h1>Cita ${statusMessages[status]}</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hola ${appointment.clientName},</h2>
          
          <p>Tu cita ha sido <strong>${statusMessages[status]}</strong>.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalles de la Cita:</h3>
            <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString('es-CO')}</p>
            <p><strong>Hora:</strong> ${appointment.time}</p>
            <p><strong>Tipo de consulta:</strong> ${appointment.consultationType}</p>
          </div>
          
          ${status === 'CONFIRMED' ? `
            <p><strong>Tu cita está confirmada.</strong> Te esperamos en la fecha y hora programada.</p>
            <p><strong>Dirección:</strong> Calle 23B sur #29-22 San Jorge 1ra Etapa, Neiva, Huila</p>
          ` : ''}
          
          ${status === 'CANCELLED' ? `
            <p>Si deseas reagendar, puedes contactarnos o usar nuestro sistema de citas online.</p>
          ` : ''}
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
          <ul>
            <li><strong>Teléfono:</strong> ${process.env.BUSINESS_PHONE}</li>
            <li><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</li>
          </ul>
          
          <p style="margin-top: 30px;">Saludos cordiales,<br><strong>${process.env.BUSINESS_NAME}</strong></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Enviar confirmación de contacto al cliente
const sendContactConfirmation = async (contact) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: contact.email,
    subject: 'Mensaje Recibido - Dra. Angy Tatiana Garzón Fierro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #66102B, #8B1538); color: white; padding: 20px; text-align: center;">
          <h1>Mensaje Recibido</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hola ${contact.name},</h2>
          
          <p>Hemos recibido tu mensaje y te contactaremos pronto. Gracias por tu interés en nuestros servicios legales.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #66102B; margin-top: 0;">Tu mensaje:</h3>
            <p style="font-style: italic;">"${contact.message}"</p>
          </div>
          
          <p>Tiempo estimado de respuesta: <strong>24-48 horas</strong></p>
          
          <p>Si es urgente, puedes contactarnos directamente:</p>
          <ul>
            <li><strong>Teléfono:</strong> ${process.env.BUSINESS_PHONE}</li>
            <li><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</li>
          </ul>
          
          <p style="margin-top: 30px;">Saludos cordiales,<br><strong>${process.env.BUSINESS_NAME}</strong></p>
        </div>
        
        <div style="background: #66102B; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© 2024 ${process.env.BUSINESS_NAME}. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Notificar a la abogada sobre nuevo contacto
const sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.BUSINESS_EMAIL,
    subject: 'Nuevo Mensaje de Contacto - Sistema Web',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #66102B; color: white; padding: 20px;">
          <h1>Nuevo Mensaje de Contacto</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Datos del Cliente:</h2>
          <p><strong>Nombre:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p><strong>Teléfono:</strong> ${contact.phone}</p>` : ''}
          
          <h2>Mensaje:</h2>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <p>${contact.message}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/admin" style="background: #66102B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver en Panel Admin
            </a>
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentNotification,
  sendAppointmentStatusUpdate,
  sendContactConfirmation,
  sendContactNotification
};