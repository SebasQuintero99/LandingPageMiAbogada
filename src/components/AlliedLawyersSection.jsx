import React from 'react';
import { UserCheck, Scale, Briefcase, Phone } from 'lucide-react';

const alliedLawyers = [
  {
    icon: <Scale className="w-12 h-12" />,
    name: 'Dr. Carlos Martínez',
    specialty: 'Derecho Penal',
    description: 'Especialista en derecho penal con más de 15 años de experiencia en defensa criminal y procesal penal.',
    features: ['Defensa Criminal', 'Procedimientos Penales', 'Habeas Corpus', 'Recursos de Apelación'],
    phone: '+57 300 123 4567'
  },
  {
    icon: <Briefcase className="w-12 h-12" />,
    name: 'Dra. María González',
    specialty: 'Derecho Civil',
    description: 'Experta en derecho civil, contratos, responsabilidad civil y derecho de familia.',
    features: ['Contratos Civiles', 'Derecho de Familia', 'Sucesiones', 'Responsabilidad Civil'],
    phone: '+57 300 234 5678'
  },
  {
    icon: <UserCheck className="w-12 h-12" />,
    name: 'Dr. Luis Rodríguez',
    specialty: 'Derecho Comercial',
    description: 'Asesor especializado en derecho comercial, societario y recuperación de cartera.',
    features: ['Derecho Societario', 'Contratos Comerciales', 'Recuperación de Cartera', 'Titulos Valores'],
    phone: '+57 300 345 6789'
  },
  {
    icon: <Scale className="w-12 h-12" />,
    name: 'Dra. Ana Vargas',
    specialty: 'Derecho Administrativo',
    description: 'Especialista en derecho administrativo, contratación estatal y procesos disciplinarios.',
    features: ['Contratación Estatal', 'Procesos Disciplinarios', 'Tutelas', 'Recursos Administrativos'],
    phone: '+57 300 456 7890'
  }
];

const AlliedLawyersSection = () => {
  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <section id="abogados-aliados" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-4">Abogados Aliados</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Red de profesionales especializados para brindar asesoría integral en todas las áreas del derecho
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {alliedLawyers.map((lawyer, index) => (
            <div key={index} className="group bg-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="text-[#66102B] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {lawyer.icon}
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-1">{lawyer.name}</h3>
                  <p className="text-[#66102B] font-medium text-lg">{lawyer.specialty}</p>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{lawyer.description}</p>
                
                <div className="space-y-2 mb-6">
                  {lawyer.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-slate-700">
                      <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleCall(lawyer.phone)}
                  className="flex items-center justify-center w-full bg-[#66102B] text-white py-3 px-6 rounded-lg hover:bg-[#8B1538] transition-colors duration-300 font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar
                </button>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#66102B] to-[#8B1538] group-hover:h-2 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlliedLawyersSection;