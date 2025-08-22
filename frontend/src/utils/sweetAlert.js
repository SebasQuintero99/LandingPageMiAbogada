import Swal from 'sweetalert2';

// Configuración base para SweetAlert2
const swalConfig = {
  buttonsStyling: false,
  customClass: {
    confirmButton: 'px-6 py-3 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f] transition-colors font-medium mr-3',
    cancelButton: 'px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium',
    popup: 'rounded-xl shadow-2xl',
    title: 'text-2xl font-bold text-gray-800 mb-2',
    content: 'text-gray-600 text-lg',
  }
};

// Mensaje de éxito para cita agendada
export const showAppointmentSuccess = (appointmentDetails) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: '¡Cita Agendada Exitosamente!',
    html: `
      <div class="text-left space-y-3 mt-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-green-800 mb-2">Detalles de tu cita:</h4>
          <div class="space-y-2 text-green-700">
            <p><span class="font-medium">📅 Fecha:</span> ${appointmentDetails.date}</p>
            <p><span class="font-medium">🕐 Hora:</span> ${appointmentDetails.time}</p>
            <p><span class="font-medium">⚖️ Tipo:</span> ${appointmentDetails.consultationType}</p>
            <p><span class="font-medium">👤 Nombre:</span> ${appointmentDetails.clientName}</p>
          </div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-800 mb-2">¿Qué sigue?</h4>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>✓ Recibirás una confirmación por email</li>
            <li>✓ Te contactaremos 24 horas antes</li>
            <li>✓ Puedes reagendar si es necesario</li>
          </ul>
        </div>
      </div>
    `,
    confirmButtonText: 'Perfecto, gracias',
    width: '500px'
  });
};

// Mensaje de error
export const showAppointmentError = (errorMessage) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'error',
    title: 'Error al Agendar Cita',
    html: `
      <div class="text-left mt-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700">${errorMessage}</p>
        </div>
        <div class="mt-4 text-gray-600">
          <p>Por favor intenta nuevamente o contacta directamente:</p>
          <div class="mt-2 space-y-1 text-sm">
            <p>📧 Email: angytatianagarzonfierrolaboral@gmail.com</p>
            <p>📱 WhatsApp: +57 317 715 4643</p>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: 'Entendido',
    width: '450px'
  });
};

// Mensaje de validación (campos faltantes)
export const showValidationError = (message) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'warning',
    title: 'Información Incompleta',
    text: message,
    confirmButtonText: 'Ok, lo corregiré',
    width: '400px'
  });
};

// Confirmación antes de enviar (opcional)
export const confirmAppointment = (appointmentDetails) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'question',
    title: '¿Confirmar Cita?',
    html: `
      <div class="text-left mt-4">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-800 mb-2">Verifica los datos:</h4>
          <div class="space-y-2 text-gray-700">
            <p><span class="font-medium">📅 Fecha:</span> ${appointmentDetails.date}</p>
            <p><span class="font-medium">🕐 Hora:</span> ${appointmentDetails.time}</p>
            <p><span class="font-medium">⚖️ Tipo:</span> ${appointmentDetails.consultationType}</p>
            <p><span class="font-medium">👤 Nombre:</span> ${appointmentDetails.clientName}</p>
            <p><span class="font-medium">📧 Email:</span> ${appointmentDetails.clientEmail}</p>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sí, agendar cita',
    cancelButtonText: 'Cancelar',
    width: '450px'
  });
};

// Loading mientras se procesa
export const showLoadingAlert = () => {
  return Swal.fire({
    title: 'Agendando tu cita...',
    html: `
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66102B]"></div>
        <p class="text-gray-600">Por favor espera un momento</p>
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    width: '300px'
  });
};

export default {
  showAppointmentSuccess,
  showAppointmentError,
  showValidationError,
  confirmAppointment,
  showLoadingAlert
};