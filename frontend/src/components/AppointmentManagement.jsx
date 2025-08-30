import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { apiRequest } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/appointments/admin?limit=100'); // Mostrar hasta 100 citas
      
      if (response.success) {
        const appointmentsData = response.data?.appointments || [];
        setAppointments(appointmentsData);
      } else {
        console.error('Error fetching appointments:', response.error);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await apiRequest(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.message) {
        // Update local state
        setAppointments(appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
      } else {
        console.error('Error updating appointment:', response.error);
        alert('Error al actualizar la cita');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error al actualizar la cita');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.consultationType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pendiente' },
      CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Confirmada' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelada' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCreatedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Quitamos el loading inicial para debug

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
          <p className="text-gray-600">Administra las citas de tus clientes</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredAppointments.length} citas
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o tipo de consulta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las citas</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando citas...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron citas con los filtros aplicados.'
                : 'Aún no hay citas programadas.'}
            </p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para desktop */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment, index) => (
                      <tr key={appointment.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.clientName}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {appointment.clientEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.time}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            {appointment.consultationType}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-1">
                            {appointment.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Confirmar"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {appointment.status === 'CONFIRMED' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            {appointment.status === 'CANCELLED' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'PENDING')}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Reactivar"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista de tarjetas para móvil y tablet */}
            <div className="lg:hidden space-y-4">
              {filteredAppointments.map((appointment, index) => (
                <div key={appointment.id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.clientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.clientEmail}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-xs">Fecha</span>
                      </div>
                      <div className="text-gray-900">{formatDate(appointment.date)}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-xs">Hora</span>
                      </div>
                      <div className="text-gray-900">{appointment.time}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Tipo de consulta
                    </div>
                    <div className="text-sm text-gray-900">{appointment.consultationType}</div>
                  </div>
                  
                  {appointment.message && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Mensaje:</div>
                      <div className="text-sm text-gray-700 line-clamp-2">{appointment.message}</div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    {appointment.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancelar
                        </button>
                      </>
                    )}
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancelar
                      </button>
                    )}
                    {appointment.status === 'CANCELLED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'PENDING')}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Reactivar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;