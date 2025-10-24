import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const IguanaForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Normalize photo URLs from comma-separated to array
      if (data.photos && typeof data.photos === 'string') {
        data.photos = data.photos.split(',').map(url => url.trim()).filter(Boolean);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || ''}/api/animal-consults`,
        { ...data, species: 'iguana' }
      );

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Formulario de Consulta - Iguana</h2>

      {/* Section I: Identificación del Paciente */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">I. Identificación del Paciente</h3>
        
        <div>
          <label className="block mb-1">Nombre del Paciente</label>
          <input
            {...register('nombre_paciente', { required: 'Este campo es requerido' })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.nombre_paciente && <span className="text-red-500">{errors.nombre_paciente.message}</span>}
        </div>

        <div>
          <label className="block mb-1">Especie</label>
          <input
            {...register('especie')}
            defaultValue="Iguana"
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: Iguana verde (Iguana iguana)"
          />
        </div>

        <div>
          <label className="block mb-1">Edad</label>
          <input
            {...register('edad')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: 3 años"
          />
        </div>

        <div>
          <label className="block mb-1">Peso (gramos/kg)</label>
          <input
            {...register('peso')}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1">Longitud Total (cm)</label>
          <input
            {...register('longitud')}
            type="number"
            step="0.1"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1">Sexo</label>
          <select {...register('sexo')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
            <option value="indeterminado">Indeterminado</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Propietario</label>
          <input
            {...register('propietario')}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </section>

      {/* Section III: Motivo de Consulta */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">III. Motivo de Consulta</h3>
        <div>
          <textarea
            {...register('motivo_consulta', { required: 'Este campo es requerido' })}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Describa el motivo de la consulta"
          />
          {errors.motivo_consulta && <span className="text-red-500">{errors.motivo_consulta.message}</span>}
        </div>
      </section>

      {/* Section IV: Anamnesis */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">IV. Anamnesis</h3>
        
        <div>
          <label className="block mb-1">Alimentación</label>
          <textarea
            {...register('alimentacion')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Vegetales, frutas, proteína, suplementos, frecuencia"
          />
        </div>

        <div>
          <label className="block mb-1">Terrario/Hábitat</label>
          <textarea
            {...register('habitat')}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Dimensiones, sustrato, plantas, escondites, fuentes de agua"
          />
        </div>

        <div>
          <label className="block mb-1">Iluminación</label>
          <textarea
            {...register('iluminacion')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="UV-B, intensidad, distancia, horas de exposición, última renovación"
          />
        </div>

        <div>
          <label className="block mb-1">Temperatura</label>
          <textarea
            {...register('temperatura_habitat')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Zona caliente, zona fría, temperatura nocturna"
          />
        </div>

        <div>
          <label className="block mb-1">Humedad</label>
          <input
            {...register('humedad')}
            className="w-full border rounded px-3 py-2"
            placeholder="Porcentaje de humedad relativa"
          />
        </div>

        <div>
          <label className="block mb-1">Comportamiento</label>
          <textarea
            {...register('comportamiento')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Actividad, apetito, defecación, muda, agresividad"
          />
        </div>

        <div>
          <label className="block mb-1">Historial Médico</label>
          <textarea
            {...register('historial_medico')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Enfermedades previas, tratamientos, cirugías"
          />
        </div>
      </section>

      {/* Section V: Examen Clínico */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">V. Examen Clínico</h3>
        
        <div>
          <label className="block mb-1">Temperatura Corporal (°C)</label>
          <input
            {...register('temperatura')}
            type="number"
            step="0.1"
            className="w-full border rounded px-3 py-2"
            placeholder="Depende de temperatura ambiental"
          />
        </div>

        <div>
          <label className="block mb-1">Frecuencia Cardíaca (lpm)</label>
          <input
            {...register('frecuencia_cardiaca')}
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Variable con temperatura"
          />
        </div>

        <div>
          <label className="block mb-1">Frecuencia Respiratoria (rpm)</label>
          <input
            {...register('frecuencia_respiratoria')}
            type="number"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1">Condición Corporal</label>
          <select {...register('condicion_corporal')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="emaciado">Emaciado</option>
            <option value="delgado">Delgado</option>
            <option value="ideal">Ideal</option>
            <option value="sobrepeso">Sobrepeso</option>
            <option value="obeso">Obeso</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Hidratación</label>
          <textarea
            {...register('hidratacion')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Elasticidad de la piel, ojos hundidos, mucosas"
          />
        </div>

        <div>
          <label className="block mb-1">Piel y Escamas</label>
          <textarea
            {...register('piel_escamas')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Color, integridad, muda, lesiones, parásitos externos"
          />
        </div>

        <div>
          <label className="block mb-1">Ojos</label>
          <textarea
            {...register('ojos')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Apertura, secreciones, claridad"
          />
        </div>

        <div>
          <label className="block mb-1">Boca/Cavidad Oral</label>
          <textarea
            {...register('boca')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Mucosas, estomatitis, dientes, lengua"
          />
        </div>

        <div>
          <label className="block mb-1">Extremidades</label>
          <textarea
            {...register('extremidades')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Deformidades, fracturas, hinchazón, movilidad"
          />
        </div>

        <div>
          <label className="block mb-1">Columna y Cola</label>
          <textarea
            {...register('columna_cola')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Desviaciones, fracturas, autotomía"
          />
        </div>

        <div>
          <label className="block mb-1">Sistemas Específicos</label>
          <textarea
            {...register('sistemas_especificos')}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Cardiovascular, respiratorio, digestivo, urinario/reproductivo, nervioso"
          />
        </div>
      </section>

      {/* Photos */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Fotos</h3>
        <div>
          <label className="block mb-1">URLs de Fotos (separadas por comas)</label>
          <input
            {...register('photos')}
            className="w-full border rounded px-3 py-2"
            placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
          />
        </div>
      </section>

      {/* Observaciones Adicionales */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Observaciones Adicionales</h3>
        <div>
          <textarea
            {...register('observaciones')}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Diagnóstico presuntivo, plan de tratamiento, recomendaciones de manejo"
          />
        </div>
      </section>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Enviar Consulta
      </button>
    </form>
  );
};

export default IguanaForm;
