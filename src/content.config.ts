import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file } from "astro/loaders";

const fortaleza = defineCollection({
  loader: file("src/content/fortaleza/fortaleza.json"),
  schema: z.object({
    day: z.number().int().min(1).max(365),
    titulo: z.string(),
    oracion: z.array(z.string()),
    salmo: z.string(),
    quote: z.string(),
  }),
});

const novenaEspirituSanto = defineCollection({
  loader: file("src/content/novenas/espiritu-santo.json"),
  schema: z.object({
    day: z.number().int().min(1).max(9),
    tema: z.string(),
    citaBiblica: z.string().nullable(),
    reflexion: z.string().nullable(),
    intencion: z.string().nullable(),
    oracion: z.string().nullable(),
  }),
});

const caminataEncarnacion = defineCollection({
  loader: file("src/content/caminata-encarnacion/caminata-encarnacion.json"),
  schema: z.object({
    day: z.number().int().min(1).max(276),
    titulo: z.string(),
    cita: z.string(),
    citaRef: z.string(),
    meditacion: z.array(z.string()),
    intencion: z.string(),
  }),
});

export const collections = { fortaleza, novenaEspirituSanto, caminataEncarnacion };
