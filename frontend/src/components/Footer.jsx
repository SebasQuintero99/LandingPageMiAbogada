import React from 'react';
import { Scale } from 'lucide-react';
import { useBusinessConfig } from '../contexts/BusinessConfigContext';

const Footer = () => {
  const { businessConfig } = useBusinessConfig();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Scale className="w-6 h-6 text-[#66102B]" />
          <span className="text-xl font-bold">{businessConfig.name}</span>
        </div>
        <p className="text-slate-400 mb-2">© 2025 Todos los derechos reservados</p>
        <p className="text-sm text-slate-500">Juan Sebastian Quintero Ortiz</p>
      </div>
    </footer>
  );
};

export default Footer;
