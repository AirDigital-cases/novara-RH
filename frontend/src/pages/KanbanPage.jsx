import { useEffect, useState } from "react";

import PipelineBoard from "../components/PipelineBoard";
import SectionCard from "../components/SectionCard";
import { candidateStageMeta, pipelineColumns } from "../lib/mockData";
import { getCandidates } from "../services/api";

function mapCandidateCard(candidate) {
  return {
    id: candidate.id,
    name: candidate.name,
    job: candidate.job?.title || "Vaga nao informada",
    score: candidate.score ?? 0,
    city: candidate.city || "Cidade nao informada",
  };
}

function buildColumns(candidates) {
  return candidateStageMeta.map((stage) => ({
    ...stage,
    items: candidates
      .filter((candidate) => candidate.status === stage.stage)
      .map(mapCandidateCard),
  }));
}

export default function KanbanPage() {
  const [columns, setColumns] = useState(pipelineColumns);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPipeline() {
      try {
        const response = await getCandidates();

        if (!isMounted) {
          return;
        }

        setColumns(buildColumns(response.items || []));
        setUsingFallback(false);
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setColumns(pipelineColumns);
        setUsingFallback(true);
      }
    }

    loadPipeline();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionCard
      eyebrow="Funil"
      title="Kanban de contratacao"
      description={
        usingFallback
          ? "API indisponivel no momento. Exibindo o funil demonstrativo."
          : "Candidatos reais agrupados por status do backend."
      }
    >
      <PipelineBoard columns={columns} />
    </SectionCard>
  );
}
