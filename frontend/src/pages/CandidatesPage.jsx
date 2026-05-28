import { Link } from "react-router-dom";

import SectionCard from "../components/SectionCard";
import { candidateHighlights } from "../lib/mockData";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Candidatos"
        title="Triagem priorizada por score"
        description="Mock visual alinhado com `GET /api/v1/candidates` e a futura filtragem por vaga ou etapa."
      >
        <div className="grid gap-4">
          {candidateHighlights.map((candidate, index) => (
            <article key={candidate.name} className="mesh-card rounded-[26px] border border-white/80 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-sand px-3 py-2 text-xs font-semibold">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-ink/60">
                    {candidate.job} • {candidate.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white">
                    Score {candidate.score}
                  </span>
                  <Link
                    to={`/candidates/${index + 1}`}
                    className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-moss hover:text-moss"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
