import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { canineFelineSchema } from '../../schemas/canineFeline.schema';

export default function CanineFelineForm({ species = 'dog', onSuccess = () => {} }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(canineFelineSchema),
    defaultValues: {
      species,
      date: '',
      pet_name: '',
      owner_name: '',
      breed: '',
      mix: false
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
      alert('Consulta enviada correctamente.');
    } catch (err) {
      console.error(err);
      alert('Error al enviar la consulta.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 980 }}>
      <h3>{species === 'dog' ? 'Formulario — Canino' : 'Formulario — Felino'}</h3>

      <div>
        <label htmlFor="cf-date">FECHA *</label><br />
        <input id="cf-date" type="date" {...register('date')} />
        {errors.date && <div style={{ color: 'red' }}>{errors.date.message}</div>}
      </div>

      <div>
        <label htmlFor="cf-pet-name">NOMBRE DE LA MASCOTA *</label><br />
        <input id="cf-pet-name" {...register('pet_name')} />
        {errors.pet_name && <div style={{ color: 'red' }}>{errors.pet_name.message}</div>}
      </div>

      <div>
        <label htmlFor="cf-owner-name">NOMBRE DEL DUEÑO *</label><br />
        <input id="cf-owner-name" {...register('owner_name')} />
        {errors.owner_name && <div style={{ color: 'red' }}>{errors.owner_name.message}</div>}
      </div>

      <div>
        <label htmlFor="cf-breed">RAZA</label><br />
        <input id="cf-breed" {...register('breed')} />
      </div>

      <div>
        <label htmlFor="cf-weight">PESO (kg)</label><br />
        <input id="cf-weight" type="number" step="0.1" {...register('weight_kg')} />
        {errors.weight_kg && <div style={{ color: 'red' }}>{errors.weight_kg.message}</div>}
      </div>

      <div style={{ marginTop: 12 }}>
        <label htmlFor="cf-photo-urls">FOTOS (URLs separadas por coma)</label><br />
        <input id="cf-photo-urls" {...register('photo_urls')} placeholder="https://... , https://..." style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={isSubmitting}>Enviar consulta</button>
      </div>
    </form>
  );
}