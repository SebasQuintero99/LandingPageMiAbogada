import React from 'react';
import { Scale, Shield } from 'lucide-react';
import logoNegra from '../assets/LOGONEGRA.svg';

const Header = ({ scrollToSection, setShowBookingModal, setCurrentView }) => {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoNegra} 
              alt="Logo" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold text-slate-900">Dra. Angy Tatiana Garzón Fierro</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('inicio')} className="text-slate-700 hover:text-[#66102B] transition-colors">
              Inicio
            </button>
            <button onClick={() => scrollToSection('servicios')} className="text-slate-700 hover:text-[#66102B] transition-colors">
              Servicios
            </button>
            <button onClick={() => scrollToSection('citas')} className="text-slate-700 hover:text-[#66102B] transition-colors">
              Agendar Cita
            </button>
            <button onClick={() => scrollToSection('sobre-mi')} className="text-slate-700 hover:text-[#66102B] transition-colors">
              Sobre mí
            </button>
            <button onClick={() => scrollToSection('contacto')} className="text-slate-700 hover:text-[#66102B] transition-colors">
              Contacto
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView && setCurrentView('admin')}
              className="hidden lg:flex items-center space-x-2 text-slate-600 hover:text-[#66102B] transition-colors"
              title="Panel de Administración"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">Admin</span>
            </button>
            
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-[#66102B] text-white px-6 py-2 rounded-full hover:bg-[#8B1538] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Consulta Gratis
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
