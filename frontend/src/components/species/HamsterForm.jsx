import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function HamsterForm({ onSuccess = () => {} }) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
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
      const resp = await axios.post('/api/animal-consults', data);
      onSuccess(resp.data);
      reset();
      alert('Consulta creada correctamente.');
    } catch (err) {
      console.error(err);
      alert('Error al crear la consulta. Revisa la consola o inténtalo nuevamente.');
    }
  };

  const subSpecies = [
    { id: 'sirio', name: 'Sirio' },
    { id: 'enano', name: 'Enano' },
    { id: 'roborovski', name: 'Roborovski' },
    { id: 'campbell', name: 'Campbell' },
    { id: 'chino', name: 'Chino' },
    { id: 'ruso', name: 'Ruso' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 900 }}>
      <fieldset>
        <legend>I. DATOS DEL PACIENTE</legend>

        <div>
          <label>Nombre del paciente</label><br />
          <input {...register('name', { required: true })} placeholder="Nombre del paciente" />
          {errors.name && <small style={{ color: 'red' }}>Requerido</small>}
        </div>

        <div>
          <label>Nombre del dueño</label><br />
          <input {...register('owner_name', { required: true })} placeholder="Nombre del dueño" />
          {errors.owner_name && <small style={{ color: 'red' }}>Requerido</small>}
        </div>

        <div>
          <label>Especie exacta / Subespecie</label><br />
          <select {...register('sub_species', { required: true })} defaultValue="">
            <option value="" disabled>Selecciona subespecie</option>
            {subSpecies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.sub_species && <small style={{ color: 'red' }}>Requerido</small>}
        </div>

        <div>
          <label>Edad exacta (meses)</label><br />
          <input type="number" {...register('age_months', { min: 0 })} />
        </div>

        <div>
          <label>Sexo</label><br />
          <label><input type="radio" value="male" {...register('sex')} /> Macho</label>
          <label style={{ marginLeft: 8 }}><input type="radio" value="female" {...register('sex')} /> Hembra</label>
        </div>

        <div>
          <label>Esterilizado</label><br />
          <label><input type="checkbox" {...register('sterilized')} /> Sí</label>
          <input {...register('sterilized_date')} placeholder="Fecha (YYYY-MM-DD)" style={{ marginLeft: 8 }} />
        </div>

        <div>
          <label>Peso actual (g)</label><br />
          <input type="number" {...register('weight_g', { min: 0 })} />
        </div>

        <div>
          <label>Índice de Condición Corporal (ICC)</label><br />
          <select {...register('icc')}>
            <option value="">--</option>
            <option value="1-3">1-3 (Emaciado)</option>
            <option value="4-5">4-5 (Delgado)</option>
            <option value="6-7">6-7 (Ideal)</option>
            <option value="8-9">8-9 (Sobrepeso)</option>
          </select>
        </div>

        <div>
          <label>Temperamento</label><br />
          <select {...register('temperament')}>
            <option value="">--</option>
            <option value="tranquilo">Tranquilo</option>
            <option value="nervioso">Nervioso</option>
            <option value="agresivo">Agresivo</option>
            <option value="timido">Tímido</option>
            <option value="hiperactivo">Hiperactivo</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>III. MOTIVO DE CONSULTA</legend>
        <div>
          <label>En sus propias palabras, ¿qué lo trae hoy?</label><br />
          <textarea {...register('owner_complaint')} rows={4} />
        </div>

        <div>
          <label>Duración exacta del problema</label><br />
          <select {...register('problem_duration')}> 
            <option value="">--</option>
            <option value="<12h">&lt;12 horas</option>
            <option value="12-24h">12-24 horas</option>
            <option value="2-3d">2-3 días</option>
            <option value="4-7d">4-7 días</option>
            <option value=">1w">&gt;1 semana</option>
          </select>
        </div>

        <div>
          <label>Progresión</label><br />
          <select {...register('progression')}>  
            <option value="">--</option>
            <option value="mejora">Mejora</option>
            <option value="estable">Estable</option>
            <option value="empeora">Empeora rápidamente</option>
            <option value="intermitente">Intermitente</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>IV. HISTORIA CLÍNICA ACTUAL</legend>

        <div>
          <label>Temperatura (°C)</label><br />
          <input type="number" step="0.1" {...register('temperature_c')} />
        </div>

        <div>
          <label>Frecuencia cardíaca (lpm)</label><br />
          <input type="number" {...register('heart_rate_lpm')} />
        </div>

        <div>
          <label>Frecuencia respiratoria (rpm)</label><br />
          <input type="number" {...register('resp_rate_rpm')} />
        </div>

        <div>
          <label>Hidratación</label><br />
          <select {...register('hydration')}>
            <option value="">--</option>
            <option value="5">5% (piel vuelve rápido)</option>
            <option value="6-8">6-8% (piel lenta)</option>
            <option value=">10">&gt;10% (piel no vuelve)</option>
          </select>
        </div>

        <div>
          <label>Color de mucosas</label><br />
          <select {...register('mucous_color')}>
            <option value="">--</option>
            <option value="rosado">Rosado</option>
            <option value="palido">Pálido</option>
            <option value="ictérico">Ictérico</option>
          </select>
        </div>
      </fieldset>

      <button type="submit" disabled={isSubmitting}>Enviar consulta</button>
    </form>
  );
}