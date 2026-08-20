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

const novenaGuadalupe = defineCollection({
  loader: file("src/content/novenas/guadalupe.json"),
  schema: z.object({
    day: z.number().int().min(1).max(9),
    tema: z.string(),
    titulo: z.string(),
    citaBiblica: z.string().nullable(),
    citaRef: z.string().nullable(),
    reflexion: z.string().nullable(),
    intencion: z.string().nullable(),
    oracion: z.string().nullable(),
    cierreTitulo: z.string().nullable(),
    cierreTexto: z.string().nullable(),
  }),
});

const novenaSanJose = defineCollection({
  loader: file("src/content/novenas/san-jose.json"),
  schema: z.object({
    day: z.number().int().min(1).max(9),
    tema: z.string(),
    titulo: z.string(),
    citaBiblica: z.string().nullable(),
    citaRef: z.string().nullable(),
    reflexion: z.string().nullable(),
    intencion: z.string().nullable(),
    oracion: z.string().nullable(),
    cierreTitulo: z.string().nullable(),
    cierreTexto: z.string().nullable(),
  }),
});

const novenaSagradoCorazon = defineCollection({
  loader: file("src/content/novenas/sagrado-corazon.json"),
  schema: z.object({
    day: z.number().int().min(1).max(9),
    tema: z.string(),
    titulo: z.string(),
    citaBiblica: z.string().nullable(),
    citaRef: z.string().nullable(),
    reflexion: z.string().nullable(),
    intencion: z.string().nullable(),
    oracion: z.string().nullable(),
    cierreTitulo: z.string().nullable(),
    cierreTexto: z.string().nullable(),
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

export const collections = {
  fortaleza,
  novenaEspirituSanto,
  novenaGuadalupe,
  novenaSanJose,
  novenaSagradoCorazon,
  caminataEncarnacion,
};
