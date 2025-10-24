import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const BirdForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Normalize photo URLs from comma-separated to array
      if (data.photos && typeof data.photos === 'string') {
        data.photos = data.photos.split(',').map(url => url.trim()).filter(Boolean);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || ''}/api/animal-consults`,
        { ...data, species: 'ave' }
      );

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Formulario de Consulta - Ave</h2>

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
          <label className="block mb-1">Especie/Tipo de Ave</label>
          <input
            {...register('especie')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: Loro, canario, periquito, cacatúa"
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
          <label className="block mb-1">Peso (gramos)</label>
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
            placeholder="Semillas, pellets, frutas, verduras, suplementos, cantidad y frecuencia"
          />
        </div>

        <div>
          <label className="block mb-1">Jaula/Hábitat</label>
          <textarea
            {...register('habitat')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Dimensiones, tipo de jaula, perchas, juguetes, sustrato, limpieza"
          />
        </div>

        <div>
          <label className="block mb-1">Condiciones Ambientales</label>
          <textarea
            {...register('condiciones_ambientales')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Temperatura, humedad, iluminación, ventilación"
          />
        </div>

        <div>
          <label className="block mb-1">Socialización</label>
          <textarea
            {...register('socializacion')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Interacción con personas, otras aves, tiempo fuera de la jaula"
          />
        </div>

        <div>
          <label className="block mb-1">Comportamiento</label>
          <textarea
            {...register('comportamiento')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Actividad, vocalización, apetito, defecación, plumaje"
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
            placeholder="Normal: 40-42°C"
          />
        </div>

        <div>
          <label className="block mb-1">Frecuencia Cardíaca (lpm)</label>
          <input
            {...register('frecuencia_cardiaca')}
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Variable según especie"
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
          <label className="block mb-1">Actitud/Comportamiento</label>
          <textarea
            {...register('actitud')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Alerta, deprimido, agresivo, letárgico"
          />
        </div>

        <div>
          <label className="block mb-1">Plumaje</label>
          <textarea
            {...register('plumaje')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Calidad, brillo, muda, áreas deplumadas, picaje, parásitos"
          />
        </div>

        <div>
          <label className="block mb-1">Pico</label>
          <textarea
            {...register('pico')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Simetría, sobrecrecimiento, fracturas, descarga nasal"
          />
        </div>

        <div>
          <label className="block mb-1">Ojos</label>
          <textarea
            {...register('ojos')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Apertura, secreciones, hinchazón, claridad"
          />
        </div>

        <div>
          <label className="block mb-1">Cavidad Oral</label>
          <textarea
            {...register('cavidad_oral')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Mucosas, lengua, paladar, lesiones"
          />
        </div>

        <div>
          <label className="block mb-1">Sistema Respiratorio</label>
          <textarea
            {...register('sistema_respiratorio')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Auscultación, sacos aéreos, estertores, disnea"
          />
        </div>

        <div>
          <label className="block mb-1">Abdomen/Cloaca</label>
          <textarea
            {...register('abdomen_cloaca')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Palpación abdominal, distensión, cloaca"
          />
        </div>

        <div>
          <label className="block mb-1">Extremidades y Patas</label>
          <textarea
            {...register('extremidades')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Garras, almohadillas, deformidades, hinchazón, movilidad"
          />
        </div>

        <div>
          <label className="block mb-1">Sistemas Específicos</label>
          <textarea
            {...register('sistemas_especificos')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Cardiovascular, digestivo, urinario/reproductivo, nervioso, musculoesquelético"
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

export default BirdForm;
