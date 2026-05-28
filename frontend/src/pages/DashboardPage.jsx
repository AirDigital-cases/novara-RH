import { useEffect, useState } from "react";

import KpiCard from "../components/KpiCard";
import PipelineBoard from "../components/PipelineBoard";
import SectionCard from "../components/SectionCard";
import { candidateHighlights, candidateStageMeta, metrics, pipelineColumns } from "../lib/mockData";
import { getCandidates, getDashboardOverview } from "../services/api";

function mapCandidateCard(candidate) {
  return {
    id: candidate.id,
    name: candidate.name,
    job: candidate.job?.title || "Vaga nao informada",
    score: candidate.score ?? 0,
    city: candidate.city || "Cidade nao informada",
    stage: candidate.status,
  };
}

function buildMetrics(overview) {
  return [
    {
      label: "Vagas abertas",
      value: String(overview.total_open_jobs ?? 0),
      delta: `${overview.scheduled_interviews ?? 0} entrevistas em andamento`,
      accent: "bg-moss",
    },
    {
      label: "Candidatos no funil",
      value: String(overview.total_candidates ?? 0),
      delta: `${(overview.candidates_by_stage || []).length} etapas com candidatos`,
      accent: "bg-clay",
    },
    {
      label: "Documentos pendentes",
      value: String(overview.pending_documents ?? 0),
      delta: overview.pending_documents ? "Revisao pendente na fila" : "Fila de documentos em dia",
      accent: "bg-amber-500",
    },
    {
      label: "Testes em andamento",
      value: String(overview.pending_tests ?? 0),
      delta: overview.pending_tests ? "Aguardando avaliacao do RH" : "Sem testes pendentes",
      accent: "bg-sky-500",
    },
  ];
}

function buildInsight(overview) {
  const topCandidate = overview.top_candidates?.[0];

  if (topCandidate) {
    return `${topCandidate.name} lidera o ranking com score ${topCandidate.score}.`;
  }

  if (overview.scheduled_interviews) {
    return `${overview.scheduled_interviews} entrevistas ja foram agendadas.`;
  }

  return "Sem destaques ainda. Assim que entrarem candidaturas, o ranking aparece aqui.";
}

function buildPipelineColumns(candidates) {
  const grouped = candidateStageMeta
    .map((stage) => ({
      ...stage,
      items: candidates
        .filter((candidate) => candidate.status === stage.stage)
        .slice(0, 3)
        .map(mapCandidateCard),
    }))
    .filter((column) => column.items.length > 0)
    .slice(0, 5);

  return grouped.length ? grouped : pipelineColumns;
}

export default function DashboardPage() {
  const [dashboardMetrics, setDashboardMetrics] = useState(metrics);
  const [ranking, setRanking] = useState(candidateHighlights);
  const [columns, setColumns] = useState(pipelineColumns);
  const [insight, setInsight] = useState("3 candidatos com score acima de 85 prontos para entrevista.");
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const [overviewResult, candidatesResult] = await Promise.allSettled([
        getDashboardOverview(),
        getCandidates(),
      ]);

      if (!isMounted) {
        return;
      }

      const hasRealOverview = overviewResult.status === "fulfilled";
      const hasRealCandidates = candidatesResult.status === "fulfilled";

      if (hasRealOverview) {
        const overview = overviewResult.value;
        setDashboardMetrics(buildMetrics(overview));
        setRanking(
          overview.top_candidates?.length
            ? overview.top_candidates.map(mapCandidateCard)
            : candidateHighlights,
        );
        setInsight(buildInsight(overview));
      } else {
        setDashboardMetrics(metrics);
        setRanking(candidateHighlights);
        setInsight("Nao foi possivel carregar o resumo agora. Exibindo modo demonstracao.");
      }

      if (hasRealCandidates) {
        setColumns(buildPipelineColumns(candidatesResult.value.items || []));
      } else {
        setColumns(pipelineColumns);
      }

      setUsingFallback(!(hasRealOverview && hasRealCandidates));
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="mesh-card rounded-[30px] border border-white/80 p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-moss/70">Operacao RH</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight">
              Visao rapida do funil para decidir quem avanca hoje.
            </h1>
          </div>
          <div className="rounded-[24px] bg-ink px-5 py-4 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">Insight</div>
            <div className="mt-2 text-lg font-medium">{insight}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard
          eyebrow="Funil"
          title="Pipeline do dia"
          description={
            usingFallback
              ? "API indisponivel no momento. Exibindo a visao demonstrativa do funil."
              : "Etapas mais ativas do pipeline real para o RH enxergar gargalos rapidamente."
          }
        >
          <PipelineBoard columns={columns} />
        </SectionCard>

        <SectionCard
          eyebrow="Ranking"
          title="Melhores candidatos"
          description="Lista curta para acelerar a tomada de decisao."
        >
          <div className="space-y-3">
            {ranking.map((candidate) => (
              <article key={candidate.id || candidate.name} className="rounded-[22px] border border-white/70 bg-white/75 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{candidate.name}</div>
                    <div className="mt-1 text-sm text-ink/60">{candidate.job}</div>
                  </div>
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">
                    {candidate.score}
                  </span>
                </div>
                <div className="mt-3 text-xs text-ink/55">
                  {candidate.city} • etapa {candidate.stage.replaceAll("_", " ")}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
