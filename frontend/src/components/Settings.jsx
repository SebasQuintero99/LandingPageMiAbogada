import React, { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  FileText,
  Bell,
  Users,
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusinessConfig } from '../contexts/BusinessConfigContext';
import ScheduleSettings from './ScheduleSettings';
import { 
  ConsultationSettings,
  NotificationSettings,
  UserSettings,
  SystemSettings
} from './SettingsComponents';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estados para diferentes secciones
  const [businessConfig, setBusinessConfig] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: ''
  });

  const [scheduleConfig, setScheduleConfig] = useState({
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '09:00',
    endTime: '17:00',
    lunchStart: '12:00',
    lunchEnd: '14:00',
    appointmentDuration: 60
  });

  const [consultationTypes, setConsultationTypes] = useState([
    { id: 1, name: 'Derecho Laboral', description: 'Consultas relacionadas con temas laborales', active: true },
    { id: 2, name: 'Seguridad Social', description: 'Pensiones y seguridad social', active: true },
    { id: 3, name: 'Despido Injustificado', description: 'Casos de despidos improcedentes', active: true }
  ]);

  const [notificationConfig, setNotificationConfig] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    reminderHours: 24,
    adminEmail: '',
    notifyNewAppointments: true,
    notifyNewContacts: true
  });

  const [systemUsers, setSystemUsers] = useState([]);

  const { apiRequest } = useAuth();
  const { refreshConfig } = useBusinessConfig();

  const tabs = [
    { id: 'business', label: 'Negocio', icon: Building2 },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'consultations', label: 'Tipos de Consulta', icon: FileText },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'system', label: 'Sistema', icon: SettingsIcon }
  ];

  const dayLabels = {
    monday: 'Lunes',
    tuesday: 'Martes', 
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      // Cargar configuración del negocio
      const businessResult = await apiRequest('/api/settings/business');
      if (businessResult.success) {
        setBusinessConfig(businessResult.data);
      }

      // Cargar configuración de horarios
      const scheduleResult = await apiRequest('/api/settings/schedule');
      if (scheduleResult.success) {
        setScheduleConfig(scheduleResult.data);
      }

      // Cargar tipos de consulta
      const consultationsResult = await apiRequest('/api/settings/consultations');
      if (consultationsResult.success) {
        setConsultationTypes(consultationsResult.data);
      }

      // Cargar configuración de notificaciones
      const notificationsResult = await apiRequest('/api/settings/notifications');
      if (notificationsResult.success) {
        setNotificationConfig(notificationsResult.data);
      }

      // Cargar usuarios del sistema
      const usersResult = await apiRequest('/api/settings/users');
      if (usersResult.success) {
        setSystemUsers(usersResult.data);
      }

    } catch (error) {
      console.error('Error loading configuration:', error);
      setMessage({ type: 'error', text: 'Error al cargar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async (section, data) => {
    setLoading(true);
    try {
      const result = await apiRequest(`/api/settings/${section}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        
        // Si se guardó configuración del negocio, refrescar el contexto global
        if (section === 'business') {
          await refreshConfig();
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al guardar la configuración' });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Gestiona la configuración del sistema</p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#66102B] text-[#66102B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'business' && (
            <BusinessSettings 
              config={businessConfig}
              setConfig={setBusinessConfig}
              onSave={(data) => saveConfiguration('business', data)}
              loading={loading}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleSettings
              config={scheduleConfig}
              setConfig={setScheduleConfig}
              onSave={(data) => saveConfiguration('schedule', data)}
              loading={loading}
              dayLabels={dayLabels}
            />
          )}

          {activeTab === 'consultations' && (
            <ConsultationSettings
              consultations={consultationTypes}
              setConsultations={setConsultationTypes}
              onSave={(data) => saveConfiguration('consultations', data)}
              loading={loading}
              showMessage={showMessage}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              config={notificationConfig}
              setConfig={setNotificationConfig}
              onSave={(data) => saveConfiguration('notifications', data)}
              loading={loading}
            />
          )}

          {activeTab === 'users' && (
            <UserSettings
              users={systemUsers}
              setUsers={setSystemUsers}
              onSave={(data) => saveConfiguration('users', data)}
              loading={loading}
              showMessage={showMessage}
            />
          )}

          {activeTab === 'system' && (
            <SystemSettings
              loading={loading}
              showMessage={showMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para configuración del negocio
const BusinessSettings = ({ config, setConfig, onSave, loading }) => {
  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(config);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Negocio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="Dra. Angy Tatiana Garzón Fierro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="angytatianagarzonfierrolaboral@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Teléfono
            </label>
            <input
              type="tel"
              value={config.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="+573177154643"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Sitio Web
            </label>
            <input
              type="url"
              value={config.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="https://miabogada.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Dirección
            </label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="Dirección completa de la oficina"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={config.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66102B] focus:border-[#66102B]"
              placeholder="Breve descripción del negocio y servicios"
            />
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

export default Settings;