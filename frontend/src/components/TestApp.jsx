import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestApp = () => {
  const { user, loading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🧪 Frontend Test with Auth
        </h1>
        <p className="text-gray-600 mb-4">
          Si puedes ver esto, React y AuthContext están funcionando correctamente.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ React renderizando correctamente
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Estado de servicios:</h3>
          <ul className="space-y-1 text-sm">
            <li>🟢 React: Funcionando</li>
            <li>🟢 Tailwind CSS: Funcionando</li>
            <li>🟢 AuthContext: Funcionando</li>
            <li>🔄 Loading: {loading ? 'true' : 'false'}</li>
            <li>👤 Usuario: {user ? user.name : 'No autenticado'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestApp;