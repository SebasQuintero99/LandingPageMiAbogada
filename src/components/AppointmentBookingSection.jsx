import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const AppointmentBookingSection = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime, 
  availableDates, 
  availableHours, 
  setShowBookingModal 
}) => {
  return (
    <section id="citas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-4">Agenda tu Consulta</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Selecciona la fecha y hora que mejor se adapte a tu disponibilidad
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#66102B]" />
              Fechas Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableDates.slice(0, 10).map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-[#66102B] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-[#66102B] hover:text-white'
                  }`}
                >
                  {date.toLocaleDateString('es-CO', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#66102B]" />
              Horarios
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableHours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => setSelectedTime(hour)}
                  disabled={!selectedDate}
                  className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                    selectedTime === hour
                      ? 'bg-[#66102B] text-white shadow-md'
                      : selectedDate
                      ? 'bg-slate-100 text-slate-700 hover:bg-[#66102B] hover:text-white'
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
            {!selectedDate && (
              <p className="text-sm text-slate-500 mt-3">Selecciona una fecha primero</p>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Resumen</h3>
            {selectedDate && selectedTime ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">Fecha seleccionada:</p>
                  <p className="text-slate-600">{selectedDate.toLocaleDateString('es-CO', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">Hora:</p>
                  <p className="text-slate-600">{selectedTime}</p>
                </div>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-[#66102B] text-white py-3 rounded-lg hover:bg-[#8B1538] transition-colors duration-300 font-semibold"
                >
                  Confirmar Cita
                </button>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                Selecciona fecha y hora para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentBookingSection;
