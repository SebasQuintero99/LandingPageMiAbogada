import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { showAppointmentSuccess, showAppointmentError, showValidationError, showLoadingAlert } from './utils/sweetAlert';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessConfigProvider } from './contexts/BusinessConfigContext';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AppointmentBookingSection from './components/AppointmentBookingSection';
import AboutSection from './components/AboutSection';
import AlliedLawyersSection from './components/AlliedLawyersSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import WhatsAppButton from './components/WhatsAppButton';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: '',
    message: ''
  });

  // Función para cargar fechas disponibles desde la API
  const loadAvailableDates = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/appointments/available-dates`);
      
      if (response.ok) {
        const data = await response.json();
        // Crear fechas evitando problemas de timezone
        const dates = data.availableDates.map(item => {
          const [year, month, day] = item.date.split('-');
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        });
        setAvailableDates(dates);
        
        // Obtener todos los horarios únicos disponibles para mostrar en la sección de horarios
        const allHours = new Set();
        data.availableDates.forEach(item => {
          item.availableHours.forEach(hour => allHours.add(hour));
        });
        setAvailableHours(Array.from(allHours).sort());
      }
    } catch (error) {
      console.error('Error loading available dates:', error);
      // Fallback a fechas por defecto en caso de error
      const dates = [];
      const today = new Date();
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date);
        }
      }
      setAvailableDates(dates);
      setAvailableHours(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']);
    }
  };

  // Función para cargar tipos de consulta desde la API
  const loadConsultationTypes = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/settings/consultations/public`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setConsultationTypes(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading consultation types:', error);
      // Fallback a tipos por defecto en caso de error
      setConsultationTypes(['Derecho Laboral', 'Seguridad Social', 'Despido Injustificado', 'Pensiones', 'Accidentes Laborales']);
    }
  };

  // Cargar fechas disponibles y tipos de consulta al montar el componente
  useEffect(() => {
    loadAvailableDates();
    loadConsultationTypes();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!selectedDate || !selectedTime) {
      showValidationError('Por favor selecciona fecha y hora');
      return;
    }

    // Validar campos obligatorios
    if (!appointmentForm.name || !appointmentForm.email || !appointmentForm.phone) {
      showValidationError('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar nombre (mínimo 2 caracteres)
    if (appointmentForm.name.length < 2) {
      showValidationError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appointmentForm.email)) {
      showValidationError('Por favor ingresa un email válido');
      return;
    }

    // Validar tipo de consulta
    if (!appointmentForm.consultationType) {
      showValidationError('Por favor selecciona el tipo de consulta');
      return;
    }

    if (!consultationTypes.includes(appointmentForm.consultationType)) {
      showValidationError('Tipo de consulta inválido');
      return;
    }

    // Validar formato de teléfono (exactamente 10 dígitos para Colombia)
    const phoneDigits = appointmentForm.phone.replace(/\D/g, ''); // Remover caracteres no numéricos
    if (phoneDigits.length !== 10) {
      showValidationError('El teléfono debe tener exactamente 10 dígitos');
      return;
    }

    // Mostrar loading
    const loadingSwal = showLoadingAlert();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const appointmentData = {
        date: selectedDate.toISOString(),
        time: selectedTime,
        clientName: appointmentForm.name,
        clientEmail: appointmentForm.email,
        clientPhone: appointmentForm.phone,
        consultationType: appointmentForm.consultationType,
        message: appointmentForm.message
      };

      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();
      
      // Cerrar loading
      loadingSwal.close();

      // Verificar si la respuesta es exitosa
      if (response.ok && result.message && result.message.includes('exitosamente')) {
        const appointmentDetails = {
          date: selectedDate.toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: selectedTime,
          consultationType: appointmentForm.consultationType,
          clientName: appointmentForm.name
        };

        await showAppointmentSuccess(appointmentDetails);
        
        // Limpiar formulario y recargar fechas disponibles
        setShowBookingModal(false);
        setSelectedDate(null);
        setSelectedTime('');
        setAppointmentForm({ name: '', email: '', phone: '', consultationType: '', message: '' });
        
        // Recargar fechas disponibles para reflejar la nueva cita
        loadAvailableDates();
      } else {
        // Manejar errores específicos de validación
        if (result.details && Array.isArray(result.details)) {
          const validationErrors = result.details.map(detail => detail.message).join(', ');
          showAppointmentError(`Error de validación: ${validationErrors}`);
        } else {
          showAppointmentError(result.error || result.message || 'Error desconocido al procesar la cita');
        }
      }
    } catch (error) {
      loadingSwal.close();
      console.error('Error booking appointment:', error);
      showAppointmentError('Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        scrollToSection={scrollToSection} 
        setShowBookingModal={setShowBookingModal}
      />
      <main>
        <HeroSection scrollToSection={scrollToSection} setShowBookingModal={setShowBookingModal} />
        <AboutSection />
        <ServicesSection />
        <AlliedLawyersSection />
        <AppointmentBookingSection 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          availableDates={availableDates}
          availableHours={availableHours}
          setShowBookingModal={setShowBookingModal}
        />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <BookingModal 
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        handleBookAppointment={handleBookAppointment}
        appointmentForm={appointmentForm}
        setAppointmentForm={setAppointmentForm}
        consultationTypes={consultationTypes}
      />
      <WhatsAppButton />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <BusinessConfigProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BusinessConfigProvider>
    </Router>
  );
};

export default App;