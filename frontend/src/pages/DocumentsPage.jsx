import SectionCard from "../components/SectionCard";
import { documentsQueue } from "../lib/mockData";

export default function DocumentsPage() {
  return (
    <SectionCard
      eyebrow="Documentos"
      title="Central de arquivos e pendencias"
      description="Area inicial para acompanhar uploads de curriculo, RG, CPF e comprovantes."
    >
      <div className="space-y-4">
        {documentsQueue.map((item) => (
          <article key={`${item.candidate}-${item.type}`} className="mesh-card rounded-[24px] border border-white/80 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.candidate}</h3>
                <p className="mt-1 text-sm text-ink/60">{item.type}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-sand px-3 py-2">{item.status}</span>
                <span>{item.age}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
