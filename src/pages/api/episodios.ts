import type { APIRoute } from "astro";
import { getRecentEpisodes } from "@/lib/spotify";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const episodes = await getRecentEpisodes(3);
    return new Response(JSON.stringify(episodes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0, s-maxage=300",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "No se pudieron cargar los episodios." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
