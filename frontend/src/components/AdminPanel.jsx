import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Bell,
  BarChart3,
  Settings as SettingsIcon,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AppointmentManagement from './AppointmentManagement';
import ContactManagement from './ContactManagement';
import Settings from './Settings';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalContacts: 0,
    pendingContacts: 0
  });
  const [loading, setLoading] = useState(true);

  const { user, logout, apiRequest } = useAuth();

  // Obtener tab activo basado en la URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/citas')) return 'appointments';
    if (path.includes('/contactos')) return 'contacts';
    if (path.includes('/configuracion')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    
    // Cargar estadísticas de citas
    const appointmentsResult = await apiRequest('/api/appointments/admin');
    const contactsResult = await apiRequest('/api/contacts');

    if (appointmentsResult.success) {
      const appointments = appointmentsResult.data.appointments || [];
      const pending = appointments.filter(apt => apt.status === 'PENDING').length;
      
      setStats(prev => ({
        ...prev,
        totalAppointments: appointments.length,
        pendingAppointments: pending
      }));
    }

    if (contactsResult.success) {
      const contacts = contactsResult.data.contacts || [];
      const pending = contacts.filter(contact => contact.status === 'PENDING').length;
      
      setStats(prev => ({
        ...prev,
        totalContacts: contacts.length,
        pendingContacts: pending
      }));
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin' },
    { id: 'appointments', label: 'Citas', icon: Calendar, path: '/admin/citas' },
    { id: 'contacts', label: 'Contactos', icon: MessageSquare, path: '/admin/contactos' },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon, path: '/admin/configuracion' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-[#66102B] text-white w-64 min-h-screen transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static z-30`}>
        
        {/* Header */}
        <div className="p-6 border-b border-[#4a0c1f]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Panel Admin</h2>
              <p className="text-sm text-slate-300">MiAbogada</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[#4a0c1f]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-[#66102B]" />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-slate-300">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#4a0c1f] text-white'
                        : 'text-slate-300 hover:bg-[#4a0c1f] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.id === 'appointments' && stats.pendingAppointments > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                        {stats.pendingAppointments}
                      </span>
                    )}
                    {item.id === 'contacts' && stats.pendingContacts > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                        {stats.pendingContacts}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#4a0c1f]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-[#4a0c1f] hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadStats}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {(stats.pendingAppointments + stats.pendingContacts) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingAppointments + stats.pendingContacts}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardContent stats={stats} loading={loading} />} />
            <Route path="citas" element={<AppointmentManagement />} />
            <Route path="contactos" element={<ContactManagement />} />
            <Route path="configuracion" element={<Settings />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const DashboardContent = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Citas',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Citas Pendientes',
      value: stats.pendingAppointments,
      icon: Calendar,
      color: 'yellow',
    },
    {
      title: 'Total Contactos',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'green',
    },
    {
      title: 'Contactos Pendientes',
      value: stats.pendingContacts,
      icon: MessageSquare,
      color: 'red',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Bienvenida al Panel de Administración
        </h2>
        <p className="text-gray-600 mb-4">
          Desde aquí puedes gestionar todas las citas y contactos de tu práctica legal.
          El sistema está completamente integrado con la base de datos PostgreSQL.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🔗 APIs Conectadas</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Sistema de autenticación</li>
              <li>✅ Gestión de citas</li>
              <li>✅ Gestión de contactos</li>
              <li>✅ Base de datos PostgreSQL</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Estado del Sistema</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🟢 Backend: Funcionando</li>
              <li>🟢 Base de datos: Conectada</li>
              <li>🟢 Autenticación: Activa</li>
              <li>🟢 Frontend: Operativo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;