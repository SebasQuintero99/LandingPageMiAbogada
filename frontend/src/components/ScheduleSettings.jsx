import React from 'react';
import { Save, Clock } from 'lucide-react';
import AdminCalendar from './AdminCalendar';

export const ScheduleSettings = ({ config, setConfig, onSave, loading, dayLabels }) => {
  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleWorkDay = (day) => {
    setConfig(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  const handleSave = () => {
    onSave(config);
  };

  if (!config || !dayLabels) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Cargando configuración de horarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Clock className="w-5 h-5 inline mr-2" />
          Configuración de Horarios
        </h3>
        
        {/* Layout responsivo: calendario y horarios lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendario de días disponibles - Lado izquierdo */}
          <div>
            <AdminCalendar config={config} setConfig={setConfig} />
          </div>

          {/* Configuración de horarios - Lado derecho */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horarios de Atención
              </h4>
              <p className="text-xs text-gray-600">
                Configura tus horarios de trabajo y duración de las citas.
              </p>
            </div>
            <div className="space-y-4">
              {/* Horario de trabajo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={config.startTime || '09:00'}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={config.endTime || '17:00'}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                  />
                </div>
              </div>

              {/* Horario de almuerzo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inicio Almuerzo
                  </label>
                  <input
                    type="time"
                    value={config.lunchStart || '12:00'}
                    onChange={(e) => handleInputChange('lunchStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fin Almuerzo
                  </label>
                  <input
                    type="time"
                    value={config.lunchEnd || '14:00'}
                    onChange={(e) => handleInputChange('lunchEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                  />
                </div>
              </div>

              {/* Duración de cita */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración de Cita (minutos)
                </label>
                <select
                  value={config.appointmentDuration || 60}
                  onChange={(e) => handleInputChange('appointmentDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1.5 horas</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleSettings;