import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SectionCard from "../components/SectionCard";
import { candidateHighlights } from "../lib/mockData";
import { getCandidates } from "../services/api";

function mapCandidate(candidate) {
  return {
    id: candidate.id,
    name: candidate.name,
    job: candidate.job?.title || "Vaga nao informada",
    city: candidate.city || "Cidade nao informada",
    score: candidate.score ?? 0,
    stage: candidate.status,
  };
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(
    candidateHighlights.map((candidate, index) => ({ ...candidate, id: index + 1 })),
  );
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCandidates() {
      try {
        const response = await getCandidates();

        if (!isMounted) {
          return;
        }

        setCandidates((response.items || []).map(mapCandidate));
        setUsingFallback(false);
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setCandidates(candidateHighlights.map((candidate, index) => ({ ...candidate, id: index + 1 })));
        setUsingFallback(true);
      }
    }

    loadCandidates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Candidatos"
        title="Triagem priorizada por score"
        description={
          usingFallback
            ? "API indisponivel no momento. Exibindo candidatos demonstrativos."
            : "Lista real conectada ao `GET /api/v1/candidates`."
        }
      >
        <div className="grid gap-4">
          {candidates.map((candidate, index) => (
            <article key={candidate.id || candidate.name} className="mesh-card rounded-[26px] border border-white/80 p-5">
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
                    to={`/candidates/${candidate.id || index + 1}`}
                    className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-moss hover:text-moss"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {!candidates.length ? (
            <article className="rounded-[26px] border border-dashed border-white/80 bg-white/50 p-8 text-center text-sm text-ink/55">
              Nenhum candidato foi encontrado no backend ainda.
            </article>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
