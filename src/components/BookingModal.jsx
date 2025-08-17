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
              placeholder="Nombre completo"
              value={appointmentForm.name}
              onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B]"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={appointmentForm.email}
              onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B]"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={appointmentForm.phone}
              onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B]"
              required
            />
            <select
              value={appointmentForm.consultationType}
              onChange={(e) => setAppointmentForm({...appointmentForm, consultationType: e.target.value})}
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66102B]"
              required
            >
              <option value="">Tipo de consulta</option>
              {consultationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
                className="flex-1 bg-[#66102B] text-white py-3 rounded-lg hover:bg-[#8B1538] transition-colors duration-300 font-semibold"
              >
                Confirmar Cita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
