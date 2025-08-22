import React, { createContext, useContext, useState, useEffect } from 'react';

// Configuración por defecto
const DEFAULT_BUSINESS_CONFIG = {
  name: 'Dra. Angy Tatiana Garzón Fierro',
  email: 'angytatianagarzonfierrolaboral@gmail.com',
  phone: '+573177154643',
  address: '',
  website: '',
  description: 'Servicios legales especializados en derecho laboral y seguridad social'
};

const BusinessConfigContext = createContext();

export const useBusinessConfig = () => {
  const context = useContext(BusinessConfigContext);
  if (!context) {
    throw new Error('useBusinessConfig must be used within a BusinessConfigProvider');
  }
  return context;
};

export const BusinessConfigProvider = ({ children }) => {
  const [businessConfig, setBusinessConfig] = useState(DEFAULT_BUSINESS_CONFIG);
  const [loading, setLoading] = useState(false);

  // Función para cargar la configuración desde el backend
  const loadBusinessConfig = async () => {
    try {
      setLoading(true);
      
      // Hacer request público para obtener configuración del negocio
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/settings/business/public`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBusinessConfig({ ...DEFAULT_BUSINESS_CONFIG, ...data.data });
        }
      }
    } catch (error) {
      console.error('Error loading business config:', error);
      // Mantener configuración por defecto en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración al inicializar
  useEffect(() => {
    loadBusinessConfig();
  }, []);

  // Función para refrescar la configuración (útil después de guardar cambios en admin)
  const refreshConfig = () => {
    loadBusinessConfig();
  };

  // Función para obtener número de WhatsApp limpio
  const getWhatsAppNumber = () => {
    return businessConfig.phone.replace(/[^0-9]/g, '');
  };

  const value = {
    businessConfig,
    setBusinessConfig,
    loading,
    refreshConfig,
    getWhatsAppNumber
  };

  return (
    <BusinessConfigContext.Provider value={value}>
      {children}
    </BusinessConfigContext.Provider>
  );
};

export default BusinessConfigContext;