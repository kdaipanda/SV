import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HamsterForm from './species/HamsterForm';
import CanineFelineForm from './species/CanineFelineForm';
import RabbitForm from './species/RabbitForm';
import IguanaForm from './species/IguanaForm';
import BirdForm from './species/BirdForm';
import PoultryForm from './species/PoultryForm';

const AnimalConsultForm = () => {
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    try {
      // Try to load from API, fallback to default list if not available
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || ''}/api/species`);
      setSpecies(response.data);
    } catch (err) {
      // Fallback to default species list if API is not available
      setSpecies([
        { id: 'hamster', name: 'Hámster' },
        { id: 'canine_feline', name: 'Canino/Felino' },
        { id: 'rabbit', name: 'Conejo' },
        { id: 'iguana', name: 'Iguana' },
        { id: 'bird', name: 'Ave (Mascota)' },
        { id: 'poultry', name: 'Ave de Corral' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (data) => {
    setSuccess(true);
    setError(null);
    console.log('Consultation submitted successfully:', data);
    // You can add navigation or additional success handling here
  };

  const handleError = (err) => {
    setSuccess(false);
    setError(err.response?.data?.message || err.message || 'Error al enviar la consulta');
    console.error('Error submitting consultation:', err);
  };

  const renderSpeciesForm = () => {
    switch (selectedSpecies) {
      case 'hamster':
        return <HamsterForm onSuccess={handleSuccess} onError={handleError} />;
      case 'canine_feline':
        return <CanineFelineForm onSuccess={handleSuccess} onError={handleError} />;
      case 'rabbit':
        return <RabbitForm onSuccess={handleSuccess} onError={handleError} />;
      case 'iguana':
        return <IguanaForm onSuccess={handleSuccess} onError={handleError} />;
      case 'bird':
        return <BirdForm onSuccess={handleSuccess} onError={handleError} />;
      case 'poultry':
        return <PoultryForm onSuccess={handleSuccess} onError={handleError} />;
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            Seleccione una especie para continuar
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Nueva Consulta Animal</h1>

      {/* Species Selection */}
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-2">
          Seleccione la Especie:
        </label>
        <select
          value={selectedSpecies}
          onChange={(e) => {
            setSelectedSpecies(e.target.value);
            setSuccess(false);
            setError(null);
          }}
          className="w-full border rounded px-4 py-3 text-lg"
        >
          <option value="">-- Seleccionar Especie --</option>
          {species.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ¡Consulta enviada exitosamente!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Species-Specific Form */}
      <div>
        {renderSpeciesForm()}
      </div>
    </div>
  );
};

export default AnimalConsultForm;
