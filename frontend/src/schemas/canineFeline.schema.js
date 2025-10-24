import { z } from 'zod';

export const canineFelineSchema = z.object({
  species: z.string().optional(),
  date: z.string().nonempty({ message: 'La fecha es obligatoria' }),
  pet_name: z.string().nonempty({ message: 'El nombre de la mascota es obligatorio' }),
  owner_name: z.string().nonempty({ message: 'El nombre del dueño es obligatorio' }),
  breed: z.string().optional(),
  mix: z.boolean().optional(),
  age: z.string().optional(),
  weight_kg: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? val : n;
  }, z.number().positive({ message: 'El peso debe ser un número positivo' }).optional()),
  body_condition: z.union([z.string(), z.undefined()]).optional(),
  sex: z.union([z.literal('male'), z.literal('female'), z.undefined()]).optional(),
  reproductive_status: z.union([z.literal('intact'), z.literal('neutered'), z.undefined()]).optional(),
  vaccines_current: z.boolean().optional(),
  vaccines_which: z.string().optional(),
  photo_urls: z.union([z.string(), z.array(z.string())]).optional()
});