import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'admin'

  return (
    <AuthProvider>
      <AppContent currentView={currentView} setCurrentView={setCurrentView} />
    </AuthProvider>
  );
};

const AppContent = ({ currentView, setCurrentView }) => {
  // Check if URL contains admin path
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      setCurrentView('admin');
    }
  }, [setCurrentView]);

  if (currentView === 'admin') {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminPanel />
      </ProtectedRoute>
    );
  }

  return <LandingPage setCurrentView={setCurrentView} />;
};

const LandingPage = ({ setCurrentView }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: '',
    message: ''
  });

  const availableHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const consultationTypes = ['Consulta General', 'Derecho Laboral', 'Seguridad Social', 'Despido Injustificado', 'Pensiones', 'Accidente Laboral'];

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Solo días laborables (lunes a viernes)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date,
          availableHours: [...availableHours]
        });
      }
    }
    
    return dates;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookAppointment = async (appointmentData) => {
    // Aquí se implementará la lógica para reservar la cita
    console.log('Cita reservada:', appointmentData);
    
    // Simular éxito
    alert('¡Cita reservada exitosamente! Te contactaremos pronto.');
    setShowBookingModal(false);
    
    // Reset form
    setAppointmentForm({
      name: '',
      email: '',
      phone: '',
      consultationType: '',
      message: ''
    });
    setSelectedDate(null);
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        scrollToSection={scrollToSection} 
        setShowBookingModal={setShowBookingModal}
        setCurrentView={setCurrentView}
      />
      <main>
        <HeroSection scrollToSection={scrollToSection} setShowBookingModal={setShowBookingModal} />
        <ServicesSection />
        <AppointmentBookingSection 
          generateAvailableDates={generateAvailableDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setShowBookingModal={setShowBookingModal}
        />
        <AboutSection />
        <AlliedLawyersSection />
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

export default App;