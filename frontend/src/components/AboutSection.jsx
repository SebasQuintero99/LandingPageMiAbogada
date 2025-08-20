import React from 'react';
import { User, Award, BookOpen } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="sobre-mi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-light text-slate-900 mb-6">Sobre mí</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                Con más de 8 años de experiencia en derecho laboral y seguridad social, 
                me dedico a defender los derechos de trabajadores y empleadores con un 
                enfoque humano y profesional.
              </p>
              <p>
                Mi compromiso es brindar asesoría legal especializada, acompañando a mis 
                clientes en cada paso del proceso legal con transparencia, dedicación y 
                resultados efectivos.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <Award className="w-6 h-6 text-[#66102B]" />
                <span className="font-medium">Especialista certificada en Derecho Laboral (En formación)</span>
              </div>
              <div className="flex items-center space-x-4">
                <BookOpen className="w-6 h-6 text-[#66102B]" />
                <span className="font-medium">Graduada de la Universidad Cooperativa de Colombia   </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-80 h-96 bg-gradient-to-br from-[#66102B] to-[#8B1538] rounded-3xl shadow-2xl flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16" />
                </div>
                <p className="text-lg">Foto Profesional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
