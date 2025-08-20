import React from 'react';
import { Calendar, Scale } from 'lucide-react';
import logoCircular from '../assets/logo_circular_v2.svg';

const HeroSection = ({ scrollToSection, setShowBookingModal }) => {
  return (
    <section id="inicio" className="pt-20 pb-20 bg-gradient-to-br from-[#66102B] via-[#8B1538] to-[#66102B] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-light mb-6 leading-tight">
              Dra. <span className="font-bold">Angy Tatiana Garzón Fierro</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-slate-200">
              Abogada Especialista
            </p>
            <p className="text-lg mb-8 text-slate-300">
              Derecho Laboral y Seguridad Social
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setShowBookingModal(true)}
                className="bg-white text-[#66102B] px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Agendar Consulta
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#66102B] transition-all duration-300"
              >
                Conocer Servicios
              </button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-96 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-white/20">
              <div className="text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6">
                  <img 
                    src={logoCircular} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg text-white/90">Justicia • Experiencia • Resultados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
