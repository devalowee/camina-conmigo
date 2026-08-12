import type { APIRoute } from "astro";
import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { checkRateLimit } from "@/lib/rateLimit";

export const prerender = false;

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return new Response(
      JSON.stringify({ error: "El nombre completo es obligatorio." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (body.name.length > 100) {
    return new Response(
      JSON.stringify({ error: "El nombre no puede superar los 100 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email) || body.email.length > 254) {
    return new Response(
      JSON.stringify({ error: "Ingresa un correo electrónico válido." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (typeof body.subject === "string" && body.subject.length > 150) {
    return new Response(
      JSON.stringify({ error: "El asunto no puede superar los 150 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (typeof body.message !== "string" || !body.message.trim()) {
    return new Response(
      JSON.stringify({ error: "El mensaje es obligatorio." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (body.message.length > 2000) {
    return new Response(
      JSON.stringify({ error: "El mensaje no puede superar los 2000 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Honeypot: real visitors never see or fill this field. Bots that auto-fill
  // every input do, so we silently pretend success without saving anything.
  if (typeof body.company === "string" && body.company.trim()) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  let ip = "unknown";
  try {
    ip = clientAddress || "unknown";
  } catch {
    ip = "unknown";
  }

  const allowed = await checkRateLimit(`contacto:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Demasiados envíos. Intenta de nuevo en unos minutos." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  await db.insert(contactMessages).values({
    name: body.name.trim(),
    email: body.email.trim(),
    subject: typeof body.subject === "string" && body.subject.trim() ? body.subject.trim() : null,
    message: body.message.trim(),
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
