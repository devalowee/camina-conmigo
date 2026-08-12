import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = Number(form.get("id"));
  const read = form.get("read") === "true";

  if (!id) {
    return new Response(null, { status: 400 });
  }

  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));

  return new Response(null, { status: 204 });
};
