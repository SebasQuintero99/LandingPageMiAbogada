import React from 'react';

const BookingModal = ({ 
  showBookingModal, 
  setShowBookingModal, 
  selectedDate, 
  selectedTime, 
  handleBookAppointment, 
  appointmentForm, 
  setAppointmentForm, 
  consultationTypes 
}) => {
  if (!showBookingModal) return null;

  // Función para verificar si el formulario es válido
  const isFormValid = () => {
    const nameValid = appointmentForm.name && appointmentForm.name.length >= 2;
    const emailValid = appointmentForm.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email);
    const phoneValid = appointmentForm.phone && appointmentForm.phone.length === 10;
    const consultationValid = appointmentForm.consultationType && consultationTypes.includes(appointmentForm.consultationType);
    
    return nameValid && emailValid && phoneValid && consultationValid && selectedDate && selectedTime;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-slate-900">Confirmar Cita</h3>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
          </div>

          {selectedDate && selectedTime && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 mb-1">Cita programada para:</p>
              <p className="font-semibold text-slate-900">
                {selectedDate.toLocaleDateString('es-CO', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} a las {selectedTime}
              </p>
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo (mínimo 2 caracteres)"
              value={appointmentForm.name}
              onChange={(e) => {
                // Solo permitir letras y espacios
                const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
                setAppointmentForm({...appointmentForm, name: value});
              }}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B] ${
                appointmentForm.name && appointmentForm.name.length < 2 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-slate-300'
              }`}
              required
            />
            {appointmentForm.name && (
              <div className={`text-sm mt-1 ${
                appointmentForm.name.length >= 2 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {appointmentForm.name.length >= 2 
                  ? '✓ Nombre válido' 
                  : `${appointmentForm.name.length}/2 caracteres mínimos`
                }
              </div>
            )}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={appointmentForm.email}
              onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B] ${
                appointmentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email)
                  ? 'border-red-300 bg-red-50' 
                  : 'border-slate-300'
              }`}
              required
            />
            {appointmentForm.email && (
              <div className={`text-sm mt-1 ${
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email)
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email)
                  ? '✓ Email válido' 
                  : 'Formato de email inválido'
                }
              </div>
            )}
            <input
              type="tel"
              placeholder="Teléfono (10 dígitos)"
              value={appointmentForm.phone}
              onChange={(e) => {
                // Solo permitir números y limitar a 10 dígitos
                const numbersOnly = e.target.value.replace(/\D/g, '');
                if (numbersOnly.length <= 10) {
                  setAppointmentForm({...appointmentForm, phone: numbersOnly});
                }
              }}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B] ${
                appointmentForm.phone && appointmentForm.phone.length !== 10 
                  ? 'border-red-300 bg-red-50' 
                  : appointmentForm.phone.length === 10
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-300'
              }`}
              maxLength="10"
              required
            />
            {appointmentForm.phone && (
              <div className={`text-sm mt-1 ${
                appointmentForm.phone.length === 10 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {appointmentForm.phone.length === 10 
                  ? '✓ Teléfono válido' 
                  : `${appointmentForm.phone.length}/10 dígitos`
                }
              </div>
            )}
            <select
              value={appointmentForm.consultationType}
              onChange={(e) => setAppointmentForm({...appointmentForm, consultationType: e.target.value})}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B] ${
                !appointmentForm.consultationType
                  ? 'border-slate-300' 
                  : 'border-green-300 bg-green-50'
              }`}
              required
            >
              <option value="">Selecciona el tipo de consulta</option>
              {consultationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {appointmentForm.consultationType && (
              <div className="text-sm mt-1 text-green-600">
                ✓ Tipo de consulta seleccionado
              </div>
            )}
            <textarea
              placeholder="Describe brevemente tu caso"
              value={appointmentForm.message}
              onChange={(e) => setAppointmentForm({...appointmentForm, message: e.target.value})}
              rows={3}
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B] resize-none"
            ></textarea>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`flex-1 py-3 rounded-lg transition-colors duration-300 font-semibold ${
                  isFormValid()
                    ? 'bg-[#66102B] text-white hover:bg-[#8B1538] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFormValid() ? 'Confirmar Cita' : 'Complete todos los campos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
