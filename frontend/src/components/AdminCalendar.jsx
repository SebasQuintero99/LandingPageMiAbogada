import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus } from 'lucide-react';

const AdminCalendar = ({ config, setConfig }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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

  // Inicializar días disponibles si no existen
  const availableDates = config.availableDates || [];

  // Función para obtener la fecha en formato string (evitando problemas de timezone)
  const getDateString = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  // Verificar si una fecha está marcada como disponible
  const isAvailable = (day) => {
    const dateString = getDateString(day);
    return availableDates.includes(dateString);
  };

  // Verificar si una fecha es del pasado
  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateToCheck < today;
  };

  // Manejar clic en un día
  const handleDayClick = (day) => {
    // No permitir seleccionar fechas pasadas
    if (isPastDate(day)) {
      return;
    }

    const dateString = getDateString(day);
    const currentlyAvailable = isAvailable(day);

    let newAvailableDates = [...availableDates];

    if (currentlyAvailable) {
      // Está disponible, quitarlo
      newAvailableDates = newAvailableDates.filter(date => date !== dateString);
    } else {
      // No está disponible, agregarlo
      newAvailableDates.push(dateString);
    }

    setConfig(prev => ({
      ...prev,
      availableDates: newAvailableDates.sort()
    }));
  };

  // Obtener el estado visual del día
  const getDayState = (day) => {
    if (isPastDate(day)) {
      return 'past';
    }
    return isAvailable(day) ? 'available' : 'unavailable';
  };

  // Estilos según el estado - Versión compacta
  const getDayStyles = (day) => {
    const state = getDayState(day);
    const baseClasses = "h-8 w-8 rounded-md text-xs font-medium transition-all duration-200 mx-auto flex items-center justify-center";
    
    if (state === 'past') {
      return `${baseClasses} bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed`;
    } else if (state === 'available') {
      return `${baseClasses} bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 cursor-pointer`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 cursor-pointer`;
    }
  };

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

  // Navegación de meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-3">
        <h4 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Días Disponibles
        </h4>
        <p className="text-xs text-gray-600">
          Clic en los días donde quieres atender citas.
        </p>
      </div>

      {/* Header del calendario - Compacto */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-1 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Nombres de días - Compacto */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-xs font-medium text-gray-500 py-1">
            {dayName}
          </div>
        ))}
      </div>

      {/* Grid del calendario - Compacto */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-8"></div>;
          }

          const state = getDayState(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={getDayStyles(day)}
              disabled={state === 'past'}
              title={
                state === 'past' 
                  ? `${day} - Fecha pasada (no disponible)` 
                  : state === 'available' 
                    ? `${day} - Disponible para citas` 
                    : `${day} - Clic para hacer disponible`
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Leyenda compacta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm mr-1"></div>
          <span>No disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded-sm mr-1"></div>
          <span>Fecha pasada</span>
        </div>
      </div>

      {/* Resumen compacto */}
      <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
        <strong>{availableDates.length}</strong> días marcados como disponibles
      </div>
    </div>
  );
};

export default AdminCalendar;