import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { hamsterSchema } from '../../schemas/hamster.schema';

export default function HamsterForm({ onSuccess = () => {} }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(hamsterSchema),
    defaultValues: {
      species: 'hamster',
      sub_species: '',
      name: '',
      owner_name: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      if (data.photo_urls && typeof data.photo_urls === 'string') {
        data.photo_urls = data.photo_urls.split(',').map(s => s.trim()).filter(Boolean);
      }
      await axios.post('/api/animal-consults', data);
      reset();
      onSuccess();
      alert('Consulta creada correctamente.');
    } catch (err) {
      console.error(err);
      alert('Error al crear la consulta.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 900 }}>
      <fieldset>
        <legend>I. DATOS DEL PACIENTE</legend>

        <div>
          <label htmlFor="ham-name">Nombre del paciente *</label><br />
          <input id="ham-name" {...register('name')} />
          {errors.name && <div style={{ color: 'red' }}>{errors.name.message}</div>}
        </div>

        <div>
          <label htmlFor="ham-owner">Nombre del dueño *</label><br />
          <input id="ham-owner" {...register('owner_name')} />
          {errors.owner_name && <div style={{ color: 'red' }}>{errors.owner_name.message}</div>}
        </div>

        <div>
          <label htmlFor="ham-subspecies">Subespecie *</label><br />
          <select id="ham-subspecies" {...register('sub_species')}> 
            <option value="">Selecciona</option>
            <option value="sirio">Sirio</option>
            <option value="enano">Enano</option>
            <option value="roborovski">Roborovski</option>
          </select>
          {errors.sub_species && <div style={{ color: 'red' }}>{errors.sub_species.message}</div>}
        </div>

        <div style={{ marginTop: 8 }}>
          <label htmlFor="ham-weight">PESO (g)</label><br />
          <input id="ham-weight" type="number" {...register('weight_g')} />
        </div>
      </fieldset>

      <div style={{ marginTop: 12 }}>
        <label htmlFor="ham-photo-urls">Fotos (URLs separadas por coma)</label><br />
        <input id="ham-photo-urls" {...register('photo_urls')} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={isSubmitting}>Enviar consulta</button>
      </div>
    </form>
  );
}