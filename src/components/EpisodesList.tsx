import { useEffect, useState } from "react";

interface SpotifyEpisode {
  id: string;
  name: string;
  releaseDate: string;
  externalUrl: string;
  imageUrl: string | null;
}

interface EpisodeCard extends SpotifyEpisode {
  date: string;
  gradient: string;
}

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(#789ba1, #e0c69e 57%, #264d5e 58%)",
  "linear-gradient(#8aa7ac, #e5cfad 58%, #395e68 59%)",
  "linear-gradient(#819fa1, #c5b087 55%, #35594f 56%)",
];

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" });

function toCard(episode: SpotifyEpisode, index: number): EpisodeCard {
  return {
    ...episode,
    date: dateFormatter.format(new Date(episode.releaseDate)).replace(".", "").toUpperCase(),
    gradient: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
  };
}

export default function EpisodesList() {
  const [cards, setCards] = useState<EpisodeCard[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/episodios")
      .then((response) => {
        if (!response.ok) throw new Error("request failed");
        return response.json() as Promise<SpotifyEpisode[]>;
      })
      .then((episodes) => {
        if (cancelled) return;
        setCards(episodes.map(toCard));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <p className="col-span-full py-12.5 text-center text-muted">No se pudieron cargar los episodios en este momento.</p>;
  }

  if (!cards) {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <article key={i} className="bg-paper">
            <div className="h-[230px] animate-pulse bg-[#e7e1d3]" />
            <div className="p-6.25">
              <div className="mb-2.5 h-6 w-3/4 animate-pulse bg-[#e7e1d3]" />
              <div className="h-3 w-1/3 animate-pulse bg-[#e7e1d3]" />
            </div>
          </article>
        ))}
      </>
    );
  }

  if (cards.length === 0) {
    return <p className="col-span-full py-12.5 text-center text-muted">No se pudieron cargar los episodios en este momento.</p>;
  }

  return (
    <>
      {cards.map((episode) => (
        <article
          key={episode.id}
          className="bg-paper transition-[transform,box-shadow] duration-[180ms] ease-out hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(21,48,61,0.1)]"
        >
          <div
            className="relative h-[230px] overflow-hidden"
            style={{
              background: episode.imageUrl
                ? `#21323a center / contain no-repeat url(${episode.imageUrl})`
                : episode.gradient,
            }}
          >
            <span className="absolute left-[22px] top-5 z-[2] text-[8px] font-bold uppercase tracking-[0.14em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,.5)]">
              {episode.date}
            </span>
            <a
              href={episode.externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Escuchar ${episode.name} en Spotify`}
              className="absolute bottom-[18px] right-[18px] z-[2] flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(255,253,248,0.93)] text-gold"
            >
              ▶
            </a>
          </div>
          <div className="p-6.25">
            <h3 className="mb-2.5 font-serif text-[25px] font-medium text-navy">{episode.name}</h3>
            <a
              href={episode.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[9px] font-bold uppercase tracking-widest text-blue"
            >
              Escuchar episodio →
            </a>
          </div>
        </article>
      ))}
    </>
  );
}
