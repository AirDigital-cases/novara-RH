import SectionCard from "../components/SectionCard";
import { candidateProfile } from "../lib/mockData";

export default function CandidateProfilePage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Perfil"
        title={candidateProfile.name}
        description={`${candidateProfile.job} • ${candidateProfile.city}`}
      >
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap gap-2">
                {candidateProfile.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sand px-3 py-2 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <dl className="mt-4 space-y-3 text-sm text-ink/65">
                <div className="flex justify-between gap-3">
                  <dt>Email</dt>
                  <dd>{candidateProfile.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Telefone</dt>
                  <dd>{candidateProfile.phone}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Etapa atual</dt>
                  <dd>{candidateProfile.stage}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Score</dt>
                  <dd>{candidateProfile.score}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Perguntas de qualificacao</h3>
              <div className="mt-4 space-y-4">
                {candidateProfile.answers.map(([question, answer]) => (
                  <div key={question} className="rounded-[18px] bg-sand/70 p-4">
                    <div className="text-sm font-semibold">{question}</div>
                    <div className="mt-2 text-sm text-ink/65">{answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Documentos</h3>
              <div className="mt-4 space-y-3">
                {candidateProfile.documents.map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between rounded-[16px] bg-sand/60 px-4 py-3 text-sm">
                    <span>{name}</span>
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Testes</h3>
              <div className="mt-4 space-y-3">
                {candidateProfile.tests.map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between rounded-[16px] bg-sand/60 px-4 py-3 text-sm">
                    <span>{name}</span>
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
