import React from 'react';
import { Scale } from 'lucide-react';

const Header = ({ scrollToSection, setShowBookingModal }) => {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/src/assets/LOGONEGRA.svg" 
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

          <button 
            onClick={() => setShowBookingModal(true)}
            className="bg-[#66102B] text-white px-6 py-2 rounded-full hover:bg-[#8B1538] transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Consulta Gratis
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
