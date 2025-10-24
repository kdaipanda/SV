import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HamsterForm from './species/HamsterForm';
import CanineFelineForm from './species/CanineFelineForm';

export default function AnimalConsultForm({ initialSpecies = null, onSuccess = () => {} }) {
  const [speciesList, setSpeciesList] = useState([
    { id: 'dog', name: 'Canino' },
    { id: 'cat', name: 'Felino' },
    { id: 'hamster', name: 'Roedor (Hamster)' },
    { id: 'bird', name: 'Ave' },
    { id: 'other', name: 'Otra' }
  ]);
  const [selected, setSelected] = useState(initialSpecies || speciesList[0].id);

  useEffect(() => {
    let mounted = true;
    axios.get('/api/species').then(res => {
      if (!mounted) return;
      if (Array.isArray(res.data) && res.data.length) {
        const mapped = res.data.map(s => ({ id: s.id || s.slug || s.name, name: s.name }));
        setSpeciesList(mapped);
        setSelected(initialSpecies || mapped[0]?.id || selected);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, [initialSpecies]);

  const renderFormFor = (sp) => {
    if (sp === 'hamster') return <HamsterForm onSuccess={onSuccess} />;
    if (sp === 'dog' || sp === 'cat') return <CanineFelineForm species={sp} onSuccess={onSuccess} />;
    return <div>Formulario general (pendiente). Selecciona la especie para mostrar el formulario específico.</div>;
  };

  return (
    <div>
      <h2>Nueva consulta — Animal</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Especie:</label>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {speciesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {renderFormFor(selected)}
    </div>
  );
}
