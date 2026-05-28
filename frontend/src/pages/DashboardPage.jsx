import KpiCard from "../components/KpiCard";
import PipelineBoard from "../components/PipelineBoard";
import SectionCard from "../components/SectionCard";
import { candidateHighlights, metrics, pipelineColumns } from "../lib/mockData";

export default function DashboardPage() {
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
            <div className="mt-2 text-lg font-medium">3 candidatos com score acima de 85 prontos para entrevista.</div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard
          eyebrow="Funil"
          title="Pipeline do dia"
          description="Etapas chave do MVP em formato Kanban para o RH enxergar gargalos rapidamente."
        >
          <PipelineBoard columns={pipelineColumns} />
        </SectionCard>

        <SectionCard
          eyebrow="Ranking"
          title="Melhores candidatos"
          description="Lista curta para acelerar a tomada de decisao."
        >
          <div className="space-y-3">
            {candidateHighlights.map((candidate) => (
              <article key={candidate.name} className="rounded-[22px] border border-white/70 bg-white/75 p-4">
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
