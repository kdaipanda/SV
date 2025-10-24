import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const PoultryForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Normalize photo URLs from comma-separated to array
      if (data.photos && typeof data.photos === 'string') {
        data.photos = data.photos.split(',').map(url => url.trim()).filter(Boolean);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || ''}/api/animal-consults`,
        { ...data, species: 'ave_corral' }
      );

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Formulario de Consulta - Ave de Corral</h2>

      {/* Section I: Identificación del Paciente */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">I. Identificación del Paciente/Lote</h3>
        
        <div>
          <label className="block mb-1">Identificación</label>
          <input
            {...register('identificacion', { required: 'Este campo es requerido' })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nombre o número de lote"
          />
          {errors.identificacion && <span className="text-red-500">{errors.identificacion.message}</span>}
        </div>

        <div>
          <label className="block mb-1">Especie</label>
          <select {...register('especie')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="gallina">Gallina</option>
            <option value="gallo">Gallo</option>
            <option value="pato">Pato</option>
            <option value="ganso">Ganso</option>
            <option value="pavo">Pavo</option>
            <option value="codorniz">Codorniz</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Raza/Línea</label>
          <input
            {...register('raza')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: Rhode Island Red, Leghorn"
          />
        </div>

        <div>
          <label className="block mb-1">Edad</label>
          <input
            {...register('edad')}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: 18 semanas"
          />
        </div>

        <div>
          <label className="block mb-1">Número de Animales Afectados</label>
          <input
            {...register('numero_animales')}
            type="number"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1">Peso Promedio (kg)</label>
          <input
            {...register('peso_promedio')}
            type="number"
            step="0.1"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1">Propósito</label>
          <select {...register('proposito')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="postura">Postura</option>
            <option value="carne">Carne</option>
            <option value="doble_proposito">Doble Propósito</option>
            <option value="ornamental">Ornamental</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Propietario/Granja</label>
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
            placeholder="Describa el motivo de la consulta (signos clínicos, mortalidad, producción)"
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
            placeholder="Tipo de alimento, marca, cantidad, frecuencia, cambios recientes"
          />
        </div>

        <div>
          <label className="block mb-1">Alojamiento</label>
          <textarea
            {...register('alojamiento')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Tipo (jaula, piso, free-range), densidad, sustrato, ventilación"
          />
        </div>

        <div>
          <label className="block mb-1">Condiciones Ambientales</label>
          <textarea
            {...register('condiciones_ambientales')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Temperatura, humedad, iluminación (horas/intensidad)"
          />
        </div>

        <div>
          <label className="block mb-1">Programa de Vacunación</label>
          <textarea
            {...register('programa_vacunacion')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Vacunas aplicadas, fechas, vía de administración"
          />
        </div>

        <div>
          <label className="block mb-1">Programa de Desparasitación</label>
          <textarea
            {...register('desparasitacion')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Productos, fechas, dosis"
          />
        </div>

        <div>
          <label className="block mb-1">Producción</label>
          <textarea
            {...register('produccion')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Huevos/día, calidad de cáscara, peso de huevo, cambios en producción"
          />
        </div>

        <div>
          <label className="block mb-1">Morbilidad y Mortalidad</label>
          <textarea
            {...register('morbilidad_mortalidad')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Número de animales enfermos, muertes recientes, tasa de mortalidad"
          />
        </div>

        <div>
          <label className="block mb-1">Historial Médico del Lote</label>
          <textarea
            {...register('historial_medico')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Enfermedades previas, tratamientos, resultados de laboratorio"
          />
        </div>
      </section>

      {/* Section V: Examen Clínico */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">V. Examen Clínico</h3>
        
        <div>
          <label className="block mb-1">Temperatura Promedio (°C)</label>
          <input
            {...register('temperatura')}
            type="number"
            step="0.1"
            className="w-full border rounded px-3 py-2"
            placeholder="Normal: 40.5-42°C"
          />
        </div>

        <div>
          <label className="block mb-1">Condición Corporal General</label>
          <select {...register('condicion_corporal')} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="emaciado">Emaciado</option>
            <option value="delgado">Delgado</option>
            <option value="ideal">Ideal</option>
            <option value="sobrepeso">Sobrepeso</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Comportamiento General</label>
          <textarea
            {...register('comportamiento')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Actividad, apetito, postura, vocalización"
          />
        </div>

        <div>
          <label className="block mb-1">Plumaje</label>
          <textarea
            {...register('plumaje')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Calidad, brillo, áreas deplumadas, picaje, parásitos externos"
          />
        </div>

        <div>
          <label className="block mb-1">Cresta y Barbillas</label>
          <textarea
            {...register('cresta_barbillas')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Color, turgencia, lesiones, necrosis"
          />
        </div>

        <div>
          <label className="block mb-1">Ojos y Senos Nasales</label>
          <textarea
            {...register('ojos_senos')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Hinchazón, secreciones, lagrimeo"
          />
        </div>

        <div>
          <label className="block mb-1">Pico y Cavidad Oral</label>
          <textarea
            {...register('pico_oral')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Lesiones, placas, mucosas"
          />
        </div>

        <div>
          <label className="block mb-1">Sistema Respiratorio</label>
          <textarea
            {...register('sistema_respiratorio')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Disnea, estertores, secreciones nasales, tos"
          />
        </div>

        <div>
          <label className="block mb-1">Sistema Digestivo</label>
          <textarea
            {...register('sistema_digestivo')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Abdomen (palpación), buche, heces (color, consistencia, sangre)"
          />
        </div>

        <div>
          <label className="block mb-1">Cloaca y Sistema Reproductivo</label>
          <textarea
            {...register('cloaca_reproductivo')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Prolapso, secreciones, condición"
          />
        </div>

        <div>
          <label className="block mb-1">Extremidades</label>
          <textarea
            {...register('extremidades')}
            className="w-full border rounded px-3 py-2"
            rows="2"
            placeholder="Pododermatitis, cojeras, deformidades, articulaciones"
          />
        </div>

        <div>
          <label className="block mb-1">Sistemas Específicos</label>
          <textarea
            {...register('sistemas_especificos')}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Cardiovascular, nervioso, musculoesquelético, piel"
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
            placeholder="Diagnóstico presuntivo, pruebas recomendadas, plan de tratamiento, medidas de bioseguridad"
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

export default PoultryForm;
