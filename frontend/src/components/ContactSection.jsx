import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useBusinessConfig } from '../contexts/BusinessConfigContext';

const ContactSection = () => {
  const { businessConfig } = useBusinessConfig();

  return (
    <section id="contacto" className="py-20 bg-[#66102B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Contacto</h2>
          <p className="text-xl text-slate-200">Estoy aquí para ayudarte</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-slate-300" />
              <div>
                <p className="font-semibold">Oficina</p>
                <p className="text-slate-300">
                  {businessConfig.address || 'Proximamente'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-slate-300" />
              <div>
                <p className="font-semibold">Teléfono</p>
                <p className="text-slate-300">{businessConfig.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-slate-300" />
              <div>
                <p className="font-semibold">Correo electrónico</p>
                <p className="text-slate-300">{businessConfig.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-slate-300" />
              <div>
                <p className="font-semibold">Horarios</p>
                <p className="text-slate-300">Lun - Vie: 8:00 AM - 6:00 PM<br />Sáb: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold mb-6">Envía un mensaje</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <textarea
                placeholder="Describe tu consulta"
                rows={4}
                className="w-full p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-white text-[#66102B] py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors duration-300"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
