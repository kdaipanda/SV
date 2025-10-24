import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function CanineFelineForm({ species = 'dog', onSuccess = () => {} }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      species,
      date: '',
      pet_name: '',
      owner_name: '',
      breed: '',
      mix: false,
      age: '',
      weight_kg: '',
      body_condition: '',
      sex: '',
      reproductive_status: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      const resp = await axios.post('/api/animal-consults', payload);
      onSuccess(resp.data);
      reset();
      alert('Consulta enviada correctamente.');
    } catch (err) {
      console.error(err);
      alert('Error al enviar la consulta. Revisa la consola.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 980 }}>
      <h3>{species === 'dog' ? 'Formulario — Canino' : 'Formulario — Felino'}</h3>

      <div>
        <label>FECHA</label><br />
        <input type="date" {...register('date')} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>NOMBRE DE LA MASCOTA</label><br />
          <input {...register('pet_name', { required: true })} />
          {errors.pet_name && <small style={{ color: 'red' }}>Requerido</small>}
        </div>
        <div style={{ flex: 1 }}>
          <label>NOMBRE DEL DUEÑO</label><br />
          <input {...register('owner_name', { required: true })} />
          {errors.owner_name && <small style={{ color: 'red' }}>Requerido</small>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div>
          <label>RAZA</label><br />
          <input {...register('breed')} placeholder="Raza" />
        </div>
        <div>
          <label>MIX</label><br />
          <label><input type="checkbox" {...register('mix')} /> Mix</label>
        </div>
        <div>
          <label>EDAD</label><br />
          <input {...register('age')} placeholder="Ej: 3 años" />
        </div>
        <div>
          <label>PESO (kg)</label><br />
          <input type="number" step="0.1" {...register('weight_kg')} />
        </div>
        <div>
          <label>CONDICION CORPORAL (1-5)</label><br />
          <select {...register('body_condition')}>
            <option value="">--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>SEXO</label><br />
        <label><input type="radio" value="female" {...register('sex')} /> Hembra</label>
        <label style={{ marginLeft: 8 }}><input type="radio" value="male" {...register('sex')} /> Macho</label>

        <label style={{ marginLeft: 20 }}>ESTADO REPRODUCTIVO</label><br />
        <label><input type="radio" value="intact" {...register('reproductive_status')} /> Entero</label>
        <label style={{ marginLeft: 8 }}><input type="radio" value="neutered" {...register('reproductive_status')} /> Castrado</label>
      </div>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Vacunas / Desparasitación</legend>
        <div>
          <label>VACUNAS VIGENTES</label><br />
          <label><input type="checkbox" {...register('vaccines_current')} /> Sí</label>
          <input {...register('vaccines_which')} placeholder="¿Cuáles?" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>DESPARASITACIÓN INTERNA</label><br />
          <label><input type="checkbox" {...register('deworm_internal_current')} /> Sí</label>
          <input {...register('deworm_internal_which')} placeholder="¿Cuál?" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>DESPARASITACIÓN EXTERNA</label><br />
          <label><input type="checkbox" {...register('deworm_external_current')} /> Sí</label>
          <input {...register('deworm_external_product')} placeholder="Producto" style={{ marginLeft: 8 }} />
          <input type="date" {...register('deworm_external_date')} style={{ marginLeft: 8 }} />
        </div>
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>HÁBITAT / ALIMENTACIÓN</legend>
        <div>
          <label>HABITAT DE LA MASCOTA</label><br />
          <label><input type="radio" value="interior" {...register('habitat')} /> Interior</label>
          <label style={{ marginLeft: 8 }}><input type="radio" value="exterior" {...register('habitat')} /> Exterior</label>
        </div>

        <div>
          <label>ZONA GEOGRÁFICA DE RESIDENCIA</label><br />
          <input {...register('geographic_zone')} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div>
            <label>ALIMENTACIÓN (SECO) marca</label><br />
            <input {...register('feeding_dry_brand')} />
          </div>
          <div>
            <label>ALIMENTACIÓN (HUMEDO) marca</label><br />
            <input {...register('feeding_wet_brand')} />
          </div>
          <div style={{ flex: 1 }}>
            <label>CASERO (detalle)</label><br />
            <input {...register('feeding_home')} />
          </div>
          <div>
            <label>Frecuencia</label><br />
            <input {...register('feeding_frequency')} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>PASEOS (SI) frecuencia</label><br />
          <input {...register('walks_frequency')} placeholder="Ej: 2 veces/día" />
          <label style={{ marginLeft: 12 }}><input type="checkbox" {...register('grooming_recent_date')} /> BAÑOS/SERVICIO DE ESTÉTICA RECIENTE</label>
          <input type="date" {...register('grooming_recent_date')} style={{ marginLeft: 8 }} />
        </div>
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Cirugías / Apariencia / Historia reportada</legend>
        <div>
          <label>CIRUGÍAS PREVIAS</label><br />
          <label><input type="checkbox" {...register('prior_surgeries')} /> Sí</label>
          <input {...register('prior_surgeries_which')} placeholder="¿Cuál?" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>ASPECTO GENERAL - PELAJE / PIEL / OÍDOS / OJOS / OTROS</label><br />
          <input {...register('appearance_coat')} placeholder="Pelo" style={{ width: '20%' }} />
          <input {...register('appearance_skin')} placeholder="Piel" style={{ width: '20%', marginLeft: 8 }} />
          <input {...register('appearance_ears')} placeholder="Oídos" style={{ width: '20%', marginLeft: 8 }} />
          <input {...register('appearance_eyes')} placeholder="Ojos" style={{ width: '20%', marginLeft: 8 }} />
          <input {...register('appearance_other')} placeholder="Otros" style={{ width: '20%', marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>HISTORIAL REPORTADO (VOMITO / DIARREA / ORINA / SECRECIONES / DIENTES / PIEL...)</label><br />
          <textarea {...register('owner_background')} rows={4} placeholder="Detalles proporcionados por el dueño" style={{ width: '100%' }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>VÓMITO</label><br />
          <label><input type="checkbox" {...register('vomiting')} /> Sí</label>
          <input {...register('vomiting_color')} placeholder="Color" style={{ marginLeft: 8 }} />
          <input {...register('vomiting_aspect')} placeholder="Aspecto" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>DIARREA</label><br />
          <label><input type="checkbox" {...register('diarrhea')} /> Sí</label>
          <input {...register('diarrhea_color')} placeholder="Color" style={{ marginLeft: 8 }} />
          <input {...register('diarrhea_aspect')} placeholder="Aspecto" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>ORINA</label><br />
          <label><input type="checkbox" {...register('urine')} /> Sí</label>
          <input {...register('urine_color')} placeholder="Color" style={{ marginLeft: 8 }} />
          <input {...register('urine_smell')} placeholder="Olor" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>SECRECION NASAL</label><br />
          <label><input type="checkbox" {...register('nasal_discharge')} /> Sí</label>
          <input {...register('nasal_discharge_color')} placeholder="Color / aspecto" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>SECRECIÓN OCULAR</label><br />
          <label><input type="checkbox" {...register('ocular_discharge')} /> Sí</label>
          <input {...register('ocular_discharge_color')} placeholder="Color / aspecto" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>DIENTES / PIEL</label><br />
          <input {...register('teeth_findings')} placeholder="Ej: gingivitis, placas..." style={{ width: '48%' }} />
          <input {...register('skin_findings')} placeholder="Ej: pulgas, dermatitis..." style={{ width: '48%', marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>ULTIMA COMIDA / FECHA</label><br />
          <input {...register('last_meal')} placeholder="Última comida" />
          <input type="date" {...register('last_meal_date')} style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>FLUIDOS</label><br />
          <label><input type="checkbox" {...register('fluids_given')} /> Sí</label>
          <input {...register('fluids_amount')} placeholder="Cantidad" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>ACTIVIDAD GENERAL</label><br />
          <select {...register('activity_general')}>
            <option value="">--</option>
            <option value="activo">Activo</option>
            <option value="pasivo">Pasivo</option>
            <option value="decaido">Decaído</option>
            <option value="aletargado">Aletargado</option>
          </select>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>MEDICAMENTOS ADMINISTRADOS</label><br />
          <label><input type="checkbox" {...register('medications_given')} /> Sí</label>
          <input {...register('medications_which')} placeholder="¿Cuál?" style={{ marginLeft: 8 }} />
        </div>
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>EXAMEN FÍSICO / SIGNOS VITALES</legend>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label>TEMPERATURA (°C)</label><br />
            <input type="number" step="0.1" {...register('temperature_c')} />
          </div>
          <div>
            <label>PUPILAS</label><br />
            <input {...register('pupils')} placeholder="Ej: normales / midriasis" />
          </div>
          <div>
            <label>GANGLIOS</label><br />
            <input {...register('lymph_nodes')} placeholder="normal / inflamados (región...)" />
          </div>
          <div>
            <label>RETORNO VENOSO</label><br />
            <select {...register('venous_return')}>
              <option value="">--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label>HIDRATACIÓN</label><br />
            <select {...register('hydration_status')}>
              <option value="">--</option>
              <option value="buena">Buena</option>
              <option value="media">Media</option>
              <option value="mala">Mala</option>
            </select>
          </div>
          <div>
            <label>MÚCOSAS</label><br />
            <select {...register('mucous_color')}>
              <option value="">--</option>
              <option value="rosada">Rosada</option>
              <option value="palida">Pálida</option>
              <option value="amarilla">Amarilla</option>
              <option value="azul">Azul</option>
            </select>
          </div>
          <div>
            <label>FRECUENCIA CARDIACA (lpm)</label><br />
            <input type="number" {...register('heart_rate')} />
          </div>
          <div>
            <label>FRECUENCIA RESPIRATORIA (rpm)</label><br />
            <input type="number" {...register('resp_rate')} />
          </div>
          <div>
            <label>TOS</label><br />
            <label><input type="checkbox" {...register('cough')} /> Sí</label>
            <select {...register('cough_type')} style={{ marginLeft: 8 }}>
              <option value="">--</option>
              <option value="seca">Seca</option>
              <option value="productiva">Productiva</option>
            </select>
          </div>
          <div>
            <label>MOTILIDAD INTESTINAL</label><br />
            <select {...register('intestinal_motility')}>
              <option value="">--</option>
              <option value="normal">Normal</option>
              <option value="ausente">Ausente</option>
              <option value="aumentada">Aumentada</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>EXAMEN DE SENSIBILIDAD CUTÁNEA (test pinchazo)</label><br />
          <label><input type="checkbox" {...register('superficial_sensitivity')} value="gira_cabeza" /> Gira la cabeza</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" {...register('superficial_sensitivity')} value="vocalizacion" /> Vocalización</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" {...register('superficial_sensitivity')} value="aparta_extremidad" /> Aparta extremidad</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" {...register('superficial_sensitivity')} value="hipersensibilidad" /> Hipersensibilidad</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" {...register('superficial_sensitivity')} value="hiposensibilidad" /> Hiposensibilidad</label>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>EXAMEN DE SENSIBILIDAD PROFUNDA (propiocepción)</label><br />
          <select {...register('deep_sensitivity')}>
            <option value="">--</option>
            <option value="positiva">Positiva</option>
            <option value="tardia">Tardía</option>
            <option value="sin_respuesta">Sin respuesta</option>
          </select>
        </div>
      </fieldset>

      <div style={{ marginTop: 12 }}>
        <label>FOTOS (URLs separadas por coma)</label><br />
        <input {...register('photo_urls')} placeholder="https://..." style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={isSubmitting}>Enviar consulta</button>
      </div>
    </form>
  );
}