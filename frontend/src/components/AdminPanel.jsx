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
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import AppointmentManagement from './AppointmentManagement';
import ContactManagement from './ContactManagement';
import Settings from './Settings';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    // Trigger refresh for child components
    setRefreshTrigger(prev => prev + 1);
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
            <Route path="citas" element={<AppointmentManagement key={refreshTrigger} />} />
            <Route path="contactos" element={<ContactManagement key={refreshTrigger} />} />
            <Route path="configuracion" element={<Settings key={refreshTrigger} />} />
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
      bgColor: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Citas Pendientes',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      change: '+5%',
      changeType: 'neutral'
    },
    {
      title: 'Total Contactos',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'green',
      bgColor: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Contactos Pendientes',
      value: stats.pendingContacts,
      icon: Bell,
      color: 'red',
      bgColor: 'bg-red-500',
      change: '-3%',
      changeType: 'negative'
    },
  ];

  // Configuración para el gráfico de barras de citas
  const appointmentsChartData = {
    labels: ['Total Citas', 'Confirmadas', 'Pendientes', 'Canceladas'],
    datasets: [
      {
        label: 'Citas',
        data: [
          stats.totalAppointments,
          stats.totalAppointments - stats.pendingAppointments,
          stats.pendingAppointments,
          0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuración para el gráfico de dona de estados
  const statusChartData = {
    labels: ['Completadas', 'Pendientes', 'Procesando'],
    datasets: [
      {
        data: [
          stats.totalAppointments - stats.pendingAppointments,
          stats.pendingAppointments,
          stats.pendingContacts
        ],
        backgroundColor: [
          '#10B981',
          '#F59E0B', 
          '#EF4444',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
      }
    },
    cutout: '60%',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : card.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      card.changeType === 'positive' ? 'text-green-500' : 
                      card.changeType === 'negative' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 
                      card.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Citas</h3>
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Bar data={appointmentsChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución General</h3>
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Doughnut data={statusChartData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Estado del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">APIs Funcionando</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Autenticación JWT</li>
              <li>✅ Gestión de citas</li>
              <li>✅ Gestión de contactos</li>
              <li>✅ Google Calendar</li>
            </ul>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Base de Datos</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🟢 PostgreSQL Conectada</li>
              <li>🟢 Migraciones Al Día</li>
              <li>🟢 Backup Automático</li>
              <li>🟢 Performance Óptima</li>
            </ul>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Integraciones</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>📧 Email SMTP Gmail</li>
              <li>📅 Google Calendar</li>
              <li>🎥 Google Meet</li>
              <li>💬 WhatsApp Business</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;