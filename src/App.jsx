import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AppointmentBookingSection from './components/AppointmentBookingSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import WhatsAppButton from './components/WhatsAppButton';

const AbogadaLandingPage = () => {
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
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora');
      return;
    }
    alert(`¡Cita agendada exitosamente!\nFecha: ${selectedDate.toLocaleDateString('es-CO')}\nHora: ${selectedTime}\nTipo: ${appointmentForm.consultationType}`);
    setShowBookingModal(false);
    setSelectedDate(null);
    setSelectedTime('');
    setAppointmentForm({ name: '', email: '', phone: '', consultationType: '', message: '' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header scrollToSection={scrollToSection} setShowBookingModal={setShowBookingModal} />
      <main>
        <HeroSection scrollToSection={scrollToSection} setShowBookingModal={setShowBookingModal} />
        <AboutSection />
        <ServicesSection />
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

export default AbogadaLandingPage;