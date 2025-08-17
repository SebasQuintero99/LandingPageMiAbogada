import React from 'react';
import { Scale, Shield, FileText, Users, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: <Scale className="w-12 h-12" />,
    title: 'Derecho Laboral',
    description: 'Contratos de trabajo, despidos, liquidaciones, conflictos laborales y representación ante autoridades.',
    features: ['Contratos laborales', 'Despidos', 'Liquidaciones', 'Acoso laboral']
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: 'Seguridad Social',
    description: 'Pensiones, invalidez, riesgos laborales, EPS, ARP y todos los aspectos de seguridad social.',
    features: ['Pensiones', 'Incapacidades', 'ARL', 'EPS']
  },
  {
    icon: <FileText className="w-12 h-12" />,
    title: 'Asesoría Empresarial',
    description: 'Consultoría para empresas en temas laborales, elaboración de contratos y políticas internas.',
    features: ['Contratos', 'Políticas', 'Capacitaciones', 'Auditorías']
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: 'Litigio Laboral',
    description: 'Representación judicial en procesos ordinarios laborales, tutelas y acciones administrativas.',
    features: ['Demandas', 'Tutelas', 'Conciliaciones', 'Apelaciones']
  }
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-4">Servicios Especializados</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ofrezco asesoría legal integral con un enfoque personalizado para cada caso
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="text-[#66102B] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#66102B] to-[#8B1538] group-hover:h-2 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
