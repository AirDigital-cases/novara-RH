import SectionCard from "../components/SectionCard";
import { jobs } from "../lib/mockData";

const statusLabel = {
  open: "Aberta",
  paused: "Pausada",
  closed: "Fechada",
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Vagas"
        title="Mapa de vagas ativas"
        description="Base visual para a listagem e o CRUD inicial de vagas no MVP."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {jobs.map((job) => (
            <article key={job.id} className="mesh-card rounded-[26px] border border-white/80 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{job.company}</p>
                </div>
                <span className="rounded-full bg-sand px-3 py-2 text-xs font-medium">
                  {statusLabel[job.status]}
                </span>
              </div>

              <dl className="mt-6 space-y-3 text-sm text-ink/65">
                <div className="flex justify-between gap-3">
                  <dt>Area</dt>
                  <dd>{job.department}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Local</dt>
                  <dd>{job.location}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Faixa</dt>
                  <dd>{job.salary}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Candidatos</dt>
                  <dd>{job.applicants}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Criar vaga"
        title="Formulario inicial"
        description="Pronto para conectar com `POST /api/v1/jobs` quando o frontend sair do modo mockado."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {["Titulo", "Empresa", "Departamento", "Localizacao", "Salario minimo", "Salario maximo"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
              />
            ),
          )}
          <textarea
            placeholder="Descricao da vaga"
            className="min-h-40 rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss md:col-span-2"
          />
        </div>
      </SectionCard>
    </div>
  );
}
