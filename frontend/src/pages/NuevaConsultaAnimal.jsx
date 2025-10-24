import React from 'react';
import AnimalConsultForm from '../components/AnimalConsultForm';

const NuevaConsultaAnimal = ({ setView }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setView && setView('dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <AnimalConsultForm />
      </div>
    </div>
  );
};

export default NuevaConsultaAnimal;
