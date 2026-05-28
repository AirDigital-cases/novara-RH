import SectionCard from "../components/SectionCard";
import { testsQueue } from "../lib/mockData";

export default function TestsPage() {
  return (
    <SectionCard
      eyebrow="Testes"
      title="Fila de desafios e avaliacao"
      description="Base visual para testes tecnicos, comportamentais e exercicios praticos."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {testsQueue.map((test) => (
          <article key={`${test.title}-${test.candidate}`} className="mesh-card rounded-[24px] border border-white/80 p-5">
            <h3 className="text-lg font-semibold">{test.title}</h3>
            <p className="mt-2 text-sm text-ink/60">{test.candidate}</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span>{test.status}</span>
              <span>{test.due}</span>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
