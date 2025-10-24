import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RabbitForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Normalize photo URLs from comma-separated to array
      if (data.photos && typeof data.photos === 'string') {
        data.photos = data.photos.split(',').map(url => url.trim()).filter(Boolean);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || ''}/api/animal-consults`,
        { ...data, species: 'conejo' }
      );

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Formulario de Consulta - Conejo</h2>

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
            defaultValue="Conejo"
            className="w-full border rounded px-3 py-2"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1">Raza</label>
          <input
            {...register('raza')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: Holland Lop, Belier"
          />
        </div>

        <div>
          <label className="block mb-1">Edad</label>
          <input
            {...register('edad')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: 2 años"
          />
        </div>

        <div>
          <label className="block mb-1">Peso (kg)</label>
          <input
            {...register('peso')}
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
          </select>
        </div>

        <div>
          <label className="block mb-1">Estado Reproductivo</label>
          <select {...register('estado_reproductivo')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="entero">Entero</option>
            <option value="castrado">Castrado</option>
            <option value="esterilizado">Esterilizado</option>
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
            placeholder="Heno, pellets, verduras frescas, frutas, cantidad y frecuencia"
          />
        </div>

        <div>
          <label className="block mb-1">Hábitat</label>
          <textarea
            {...register('habitat')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Tipo de jaula/espacio, sustrato, enriquecimiento ambiental"
          />
        </div>

        <div>
          <label className="block mb-1">Comportamiento</label>
          <textarea
            {...register('comportamiento')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Actividad, apetito, eliminación (cecotrofos), socialización"
          />
        </div>

        <div>
          <label className="block mb-1">Cuidado Dental</label>
          <textarea
            {...register('cuidado_dental')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Desgaste natural de dientes, problemas dentales previos"
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
          <label className="block mb-1">Temperatura (°C)</label>
          <input
            {...register('temperatura')}
            type="number"
            step="0.1"
            className="w-full border rounded px-3 py-2"
            placeholder="Normal: 38.5-40°C"
          />
        </div>

        <div>
          <label className="block mb-1">Frecuencia Cardíaca (lpm)</label>
          <input
            {...register('frecuencia_cardiaca')}
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Normal: 130-325 lpm"
          />
        </div>

        <div>
          <label className="block mb-1">Frecuencia Respiratoria (rpm)</label>
          <input
            {...register('frecuencia_respiratoria')}
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Normal: 30-60 rpm"
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
          <label className="block mb-1">Mucosas</label>
          <input
            {...register('mucosas')}
            className="w-full border rounded px-3 py-2"
            placeholder="Color, humedad"
          />
        </div>

        <div>
          <label className="block mb-1">Dientes</label>
          <textarea
            {...register('dientes')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Incisivos, molares, maloclusión, sobrecrecimiento, abscesos"
          />
        </div>

        <div>
          <label className="block mb-1">Pelaje y Piel</label>
          <textarea
            {...register('pelaje_piel')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Calidad, áreas alopécicas, lesiones, parásitos"
          />
        </div>

        <div>
          <label className="block mb-1">Sistema Gastrointestinal</label>
          <textarea
            {...register('sistema_gastrointestinal')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Palpación abdominal, ruidos intestinales, producción fecal"
          />
        </div>

        <div>
          <label className="block mb-1">Sistemas Específicos</label>
          <textarea
            {...register('sistemas_especificos')}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Cardiovascular, respiratorio, urinario, nervioso, musculoesquelético, ojos, oídos"
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
            placeholder="Diagnóstico presuntivo, plan de tratamiento, recomendaciones"
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

export default RabbitForm;
