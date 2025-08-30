const { google } = require('googleapis');
const path = require('path');

// Ruta al archivo de credenciales
const CREDENTIALS_PATH = path.join(__dirname, 'miabogada-calendar-11a75b3d9b7f.json');

// Configurar autenticación
const authenticate = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return auth;
};

// Crear evento en Google Calendar con Meet
const createCalendarEvent = async (appointmentData) => {
  try {
    const auth = authenticate();
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Crear la fecha correctamente en zona horaria de Colombia
    const appointmentDate = new Date(appointmentData.date);
    const [hours, minutes] = appointmentData.time.split(':');
    
    // Extraer solo año, mes y día para evitar problemas de timezone
    const year = appointmentDate.getUTCFullYear();
    const month = appointmentDate.getUTCMonth();
    const day = appointmentDate.getUTCDate();
    
    // Crear fecha específicamente en zona horaria de Colombia (UTC-5)
    // Sumamos 5 horas para compensar el offset de Colombia
    const correctDate = new Date(Date.UTC(year, month, day, parseInt(hours) + 5, parseInt(minutes), 0, 0));
    
    // Calcular fecha de fin (1 hora después)
    const endDate = new Date(correctDate.getTime() + 60 * 60 * 1000);
    
    // Generar un Meet link simple para la cita
    const meetLink = 'https://meet.google.com/new';
    
    // Configurar evento
    const event = {
      summary: `Consulta: ${appointmentData.consultationType} - ${appointmentData.clientName}`,
      start: {
        dateTime: correctDate.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota',
      },
      // Comentamos attendees por ahora para evitar error de permisos
      // attendees: [
      //   {
      //     email: appointmentData.clientEmail,
      //     displayName: appointmentData.clientName,
      //   }
      // ],
      // Crear manualmente un link de Google Meet
      description: `
Consulta legal con ${appointmentData.clientName}

Detalles:
• Cliente: ${appointmentData.clientName}
• Email: ${appointmentData.clientEmail}
• Teléfono: ${appointmentData.clientPhone}
• Tipo: ${appointmentData.consultationType}
${appointmentData.message ? `• Mensaje: ${appointmentData.message}` : ''}

🎥 LINK DE VIDEOCONFERENCIA:
https://meet.google.com/new

Instrucciones:
1. Haz click en el link 5 minutos antes de la cita
2. Comparte el link generado con el cliente por WhatsApp o email

Esta cita fue agendada a través del sistema web.
      `.trim(),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'email', minutes: 60 },      // 1 hora antes
          { method: 'popup', minutes: 30 },      // 30 min antes
        ],
      },
    };

    // Crear el evento
    // Usar tu email específico como calendario ID
    const response = await calendar.events.insert({
      calendarId: 'angytatianagarzonfierrolaboral@gmail.com',
      resource: event,
      sendUpdates: 'none', // No enviar invitaciones automáticas
    });

    return {
      success: true,
      eventId: response.data.id,
      meetLink: meetLink, // Usamos nuestro link generado
      htmlLink: response.data.htmlLink,
      event: response.data,
    };

  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw new Error(`Error al crear evento en Google Calendar: ${error.message}`);
  }
};

// Actualizar evento existente
const updateCalendarEvent = async (eventId, updates) => {
  try {
    const auth = authenticate();
    const calendar = google.calendar({ version: 'v3', auth });
    
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: updates,
    });

    return {
      success: true,
      event: response.data,
    };
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    throw new Error(`Error al actualizar evento: ${error.message}`);
  }
};

// Eliminar evento
const deleteCalendarEvent = async (eventId) => {
  try {
    const auth = authenticate();
    const calendar = google.calendar({ version: 'v3', auth });
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    throw new Error(`Error al eliminar evento: ${error.message}`);
  }
};

// Obtener información del mes usando Google Calendar API
const getMonthInfo = async (year, month) => {
  try {
    const auth = authenticate();
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Crear fecha de inicio y fin del mes
    const startOfMonth = new Date(year, month - 1, 1); // month - 1 porque Date usa 0-based
    const endOfMonth = new Date(year, month, 0); // Día 0 del siguiente mes = último día del mes anterior
    
    // Formatear fechas para la API
    const timeMin = startOfMonth.toISOString();
    const timeMax = endOfMonth.toISOString();
    
    // Obtener eventos del mes para verificar que el calendario funciona
    const response = await calendar.events.list({
      calendarId: 'angytatianagarzonfierrolaboral@gmail.com',
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      success: true,
      year: year,
      month: month,
      monthName: startOfMonth.toLocaleDateString('es-CO', { month: 'long' }),
      daysInMonth: endOfMonth.getDate(),
      startDate: startOfMonth,
      endDate: endOfMonth,
      calendarWorking: true,
    };

  } catch (error) {
    console.error('Error getting month info from Google Calendar:', error);
    
    // Fallback: calcular localmente si la API falla
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    
    return {
      success: false,
      year: year,
      month: month,
      monthName: startOfMonth.toLocaleDateString('es-CO', { month: 'long' }),
      daysInMonth: endOfMonth.getDate(),
      startDate: startOfMonth,
      endDate: endOfMonth,
      calendarWorking: false,
      error: error.message,
    };
  }
};

module.exports = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getMonthInfo,
};