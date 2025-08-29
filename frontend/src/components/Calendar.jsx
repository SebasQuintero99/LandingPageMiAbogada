import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selectedDate, setSelectedDate, availableDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Actualizar el mes cuando cambien las fechas disponibles
  useEffect(() => {
    if (availableDates.length > 0) {
      const firstAvailableDate = availableDates[0];
      setCurrentDate(new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1));
    }
  }, [availableDates]);
  
  // Obtener el primer día del mes y la cantidad de días
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo

  // Nombres de días y meses
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Verificar si una fecha está disponible
  const isDateAvailable = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Convertir fecha a string formato YYYY-MM-DD para comparar con admin config
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    
    return availableDates.some(availableDate => {
      // Si es string (formato admin), comparar directamente
      if (typeof availableDate === 'string') {
        return availableDate === dateString;
      }
      // Si es objeto Date, convertir a string
      if (availableDate instanceof Date) {
        return availableDate.toDateString() === date.toDateString();
      }
      return false;
    });
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedDate.toDateString() === date.toDateString();
  };

  // Manejar selección de fecha
  const handleDateSelect = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (isDateAvailable(day)) {
      setSelectedDate(date);
    }
  };

  // Navegación de meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Verificar si podemos navegar a meses anteriores/posteriores
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  
  const hasAvailableDatesInPreviousMonth = availableDates.some(date => 
    date.getMonth() === previousMonth.getMonth() && 
    date.getFullYear() === previousMonth.getFullYear()
  );
  const hasAvailableDatesInNextMonth = availableDates.some(date => 
    date.getMonth() === nextMonth.getMonth() && 
    date.getFullYear() === nextMonth.getFullYear()
  );
  
  const canGoPrevious = hasAvailableDatesInPreviousMonth;
  const canGoNext = hasAvailableDatesInNextMonth;

  // Generar días del calendario
  const calendarDays = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* Header del calendario */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className={`p-2 rounded-lg transition-colors ${
            canGoPrevious 
              ? 'text-slate-600 hover:bg-slate-100' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-semibold text-slate-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-colors ${
            canGoNext 
              ? 'text-slate-600 hover:bg-slate-100' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Nombres de días */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-sm font-medium text-slate-500 py-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-10"></div>;
          }

          const isAvailable = isDateAvailable(day);
          const isSelected = isDateSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleDateSelect(day)}
              disabled={!isAvailable}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 mx-auto ${
                isSelected
                  ? 'bg-[#66102B] text-white shadow-md'
                  : isAvailable
                  ? 'bg-green-100 text-green-700 hover:bg-[#66102B] hover:text-white border border-green-200'
                  : 'text-gray-400 cursor-not-allowed bg-gray-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#66102B] rounded mr-2"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
          <span>No disponible</span>
        </div>
      </div>

      {/* Información adicional */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Fecha seleccionada:</span><br/>
            {selectedDate.toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;