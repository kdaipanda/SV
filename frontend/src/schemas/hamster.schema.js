import { z } from 'zod';

export const hamsterSchema = z.object({
  species: z.string().optional(),
  sub_species: z.string().nonempty({ message: 'Selecciona la subespecie' }),
  name: z.string().nonempty({ message: 'Nombre del paciente es obligatorio' }),
  owner_name: z.string().nonempty({ message: 'Nombre del dueño es obligatorio' }),
  age_months: z.preprocess((v) => v === '' ? undefined : Number(v), z.number().min(0).optional()),
  sex: z.union([z.literal('male'), z.literal('female'), z.undefined()]).optional(),
  sterilized: z.boolean().optional(),
  weight_g: z.preprocess((v) => v === '' ? undefined : Number(v), z.number().min(0).optional()),
  temperature_c: z.preprocess((v) => v === '' ? undefined : Number(v), z.number().optional()),
  photo_urls: z.union([z.string(), z.array(z.string())]).optional()
});