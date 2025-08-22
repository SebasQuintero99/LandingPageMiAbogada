import React, { useState } from 'react';
import {
  Save,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Bell,
  Users,
  Download,
  Upload,
  Database,
  RefreshCw,
  Shield,
  Key,
  AlertTriangle
} from 'lucide-react';

// Componente para configuración de horarios
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Clock className="w-5 h-5 inline mr-2" />
          Configuración de Horarios
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Días de trabajo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Días de Trabajo
            </label>
            <div className="space-y-2">
              {Object.entries(dayLabels).map(([day, label]) => (
                <label key={day} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.workDays.includes(day)}
                    onChange={() => toggleWorkDay(day)}
                    className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={config.startTime}
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
                  value={config.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inicio Almuerzo
                </label>
                <input
                  type="time"
                  value={config.lunchStart}
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
                  value={config.lunchEnd}
                  onChange={(e) => handleInputChange('lunchEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración de Cita (minutos)
              </label>
              <select
                value={config.appointmentDuration}
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

// Componente para tipos de consulta
export const ConsultationSettings = ({ consultations, setConsultations, onSave, loading, showMessage }) => {
  const [editingId, setEditingId] = useState(null);
  const [newConsultation, setNewConsultation] = useState({ name: '', description: '', active: true });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id) => {
    setEditingId(null);
    onSave(consultations);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de consulta?')) {
      setConsultations(prev => prev.filter(c => c.id !== id));
      showMessage('success', 'Tipo de consulta eliminado');
    }
  };

  const handleAdd = () => {
    if (newConsultation.name.trim()) {
      const id = Date.now();
      setConsultations(prev => [...prev, { ...newConsultation, id }]);
      setNewConsultation({ name: '', description: '', active: true });
      setShowAddForm(false);
      showMessage('success', 'Tipo de consulta agregado');
    }
  };

  const handleInputChange = (id, field, value) => {
    setConsultations(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const toggleActive = (id) => {
    setConsultations(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Tipos de Consulta
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Tipo</span>
        </button>
      </div>

      {/* Formulario para agregar nuevo tipo */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Nuevo Tipo de Consulta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newConsultation.name}
                onChange={(e) => setNewConsultation(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                placeholder="Ej: Derecho Laboral"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <input
                type="text"
                value={newConsultation.description}
                onChange={(e) => setNewConsultation(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                placeholder="Descripción breve del tipo de consulta"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f]"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista de tipos de consulta */}
      <div className="space-y-3">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {editingId === consultation.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={consultation.name}
                      onChange={(e) => handleInputChange(consultation.id, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                    />
                    <input
                      type="text"
                      value={consultation.description}
                      onChange={(e) => handleInputChange(consultation.id, 'description', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-900">{consultation.name}</h4>
                    <p className="text-sm text-gray-600">{consultation.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consultation.active}
                    onChange={() => toggleActive(consultation.id)}
                    className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                  />
                  <span className="text-sm text-gray-600">Activo</span>
                </label>
                
                {editingId === consultation.id ? (
                  <button
                    onClick={() => handleSave(consultation.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(consultation.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(consultation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(consultations)}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
        </button>
      </div>
    </div>
  );
};

// Componente para configuración de notificaciones
export const NotificationSettings = ({ config, setConfig, onSave, loading }) => {
  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(config);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Bell className="w-5 h-5 inline mr-2" />
          Configuración de Notificaciones
        </h3>
        
        <div className="space-y-6">
          {/* Tipos de notificaciones */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Canales de Notificación</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                />
                <span className="text-sm text-gray-700">Notificaciones por Email</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                />
                <span className="text-sm text-gray-700">Notificaciones por SMS</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.whatsappNotifications}
                  onChange={(e) => handleInputChange('whatsappNotifications', e.target.checked)}
                  className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                />
                <span className="text-sm text-gray-700">Notificaciones por WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Configuración de recordatorios */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recordatorios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enviar recordatorio (horas antes)
                </label>
                <select
                  value={config.reminderHours}
                  onChange={(e) => handleInputChange('reminderHours', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                >
                  <option value={1}>1 hora antes</option>
                  <option value={2}>2 horas antes</option>
                  <option value={4}>4 horas antes</option>
                  <option value={24}>1 día antes</option>
                  <option value={48}>2 días antes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email del administrador
                </label>
                <input
                  type="email"
                  value={config.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                  placeholder="admin@miabogada.com"
                />
              </div>
            </div>
          </div>

          {/* Eventos que generan notificaciones */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Notificar cuando:</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.notifyNewAppointments}
                  onChange={(e) => handleInputChange('notifyNewAppointments', e.target.checked)}
                  className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                />
                <span className="text-sm text-gray-700">Se agenda una nueva cita</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.notifyNewContacts}
                  onChange={(e) => handleInputChange('notifyNewContacts', e.target.checked)}
                  className="w-4 h-4 text-[#66102B] border-gray-300 rounded focus:ring-[#66102B]"
                />
                <span className="text-sm text-gray-700">Llega un nuevo mensaje de contacto</span>
              </label>
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

// Componente para gestión de usuarios
export const UserSettings = ({ users, setUsers, onSave, loading, showMessage }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'ADMIN' });

  const handleAddUser = () => {
    if (newUser.name.trim() && newUser.email.trim()) {
      const id = Date.now();
      setUsers(prev => [...prev, { ...newUser, id, createdAt: new Date().toISOString() }]);
      setNewUser({ name: '', email: '', role: 'ADMIN' });
      setShowAddForm(false);
      showMessage('success', 'Usuario agregado correctamente');
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      showMessage('success', 'Usuario eliminado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          <Users className="w-5 h-5 inline mr-2" />
          Gestión de Usuarios
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Usuario</span>
        </button>
      </div>

      {/* Formulario para agregar usuario */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Nuevo Usuario</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
                placeholder="usuario@miabogada.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              >
                <option value="ADMIN">Administrador</option>
                <option value="USER">Usuario</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-[#66102B] text-white rounded-lg hover:bg-[#4a0c1f]"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(users)}
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

// Componente para configuración del sistema
export const SystemSettings = ({ loading, showMessage }) => {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      // Simular descarga de backup
      showMessage('success', 'Backup generado exitosamente');
      
      // Crear un enlace de descarga simulado
      const data = {
        timestamp: new Date().toISOString(),
        data: 'backup_data_placeholder'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `miabogada-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      showMessage('error', 'Error al generar backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setRestoreLoading(true);
    try {
      // Simular restauración
      await new Promise(resolve => setTimeout(resolve, 2000));
      showMessage('success', 'Sistema restaurado exitosamente');
    } catch (error) {
      showMessage('error', 'Error al restaurar el sistema');
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Configuración del Sistema
      </h3>

      {/* Backup y Restauración */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Backup y Restauración</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Descarga una copia de seguridad de todos los datos del sistema
            </p>
            <button
              onClick={handleBackup}
              disabled={backupLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${backupLoading ? 'animate-spin' : ''}`} />
              <span>{backupLoading ? 'Generando...' : 'Descargar Backup'}</span>
            </button>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Restaura el sistema desde una copia de seguridad
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="restore-file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
                disabled={restoreLoading}
              />
              <label
                htmlFor="restore-file"
                className={`flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer ${
                  restoreLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className={`w-4 h-4 ${restoreLoading ? 'animate-spin' : ''}`} />
                <span>{restoreLoading ? 'Restaurando...' : 'Restaurar Sistema'}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> La restauración sobrescribirá todos los datos actuales. 
              Asegúrate de hacer un backup antes de proceder.
            </p>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Información del Sistema</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Frontend</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• React + Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Lucide Icons</li>
              <li>• Puerto: 5173</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Backend</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Node.js + Express</li>
              <li>• PostgreSQL + Prisma</li>
              <li>• JWT Authentication</li>
              <li>• Puerto: 3001</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Configuración Avanzada */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Configuración Avanzada</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de Sesión (minutos)
            </label>
            <select className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]">
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={240}>4 horas</option>
              <option value={1440}>24 horas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de citas por día
            </label>
            <input
              type="number"
              min="1"
              max="50"
              defaultValue={10}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};