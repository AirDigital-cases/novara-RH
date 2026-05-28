import { useEffect, useState } from "react";

import SectionCard from "../components/SectionCard";
import { jobs } from "../lib/mockData";
import { createJob, getCompanies, getJobs } from "../services/api";

const statusLabel = {
  open: "Aberta",
  paused: "Pausada",
  closed: "Fechada",
};

const initialForm = {
  company_id: "",
  title: "",
  department: "",
  location: "",
  salary_min: "",
  salary_max: "",
  description: "",
};

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function formatSalaryRange(job) {
  const min = formatCurrency(job.salary_min);
  const max = formatCurrency(job.salary_max);

  if (min && max) {
    return `${min} - ${max}`;
  }

  if (min) {
    return `A partir de ${min}`;
  }

  if (max) {
    return `Ate ${max}`;
  }

  return "Faixa nao informada";
}

function mapJob(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company?.name || `Empresa #${job.company_id}`,
    department: job.department || "Nao informado",
    location: job.location || "Nao informado",
    salary: formatSalaryRange(job),
    status: job.status,
    applicants: "—",
  };
}

export default function JobsPage() {
  const [jobsList, setJobsList] = useState(jobs);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [usingFallback, setUsingFallback] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [jobsResult, companiesResult] = await Promise.allSettled([getJobs(), getCompanies()]);

      if (!isMounted) {
        return;
      }

      if (jobsResult.status === "fulfilled") {
        setJobsList((jobsResult.value.items || []).map(mapJob));
        setUsingFallback(false);
      } else {
        setJobsList(jobs);
        setUsingFallback(true);
      }

      if (companiesResult.status === "fulfilled") {
        const items = companiesResult.value.items || [];
        setCompanies(items);

        if (items.length) {
          setForm((current) => ({
            ...current,
            company_id: current.company_id || String(items[0].id),
          }));
        }
      } else {
        setCompanies([]);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ error: "", success: "" });
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        company_id: Number(form.company_id),
        salary_min: form.salary_min || undefined,
        salary_max: form.salary_max || undefined,
      };

      const response = await createJob(payload);
      setJobsList((current) => [mapJob(response.job), ...current]);
      setUsingFallback(false);
      setForm((current) => ({
        ...initialForm,
        company_id: current.company_id,
      }));
      setFeedback({ error: "", success: "Vaga criada com sucesso." });
    } catch (error) {
      setFeedback({
        error: error.message || "Nao foi possivel criar a vaga agora.",
        success: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Vagas"
        title="Mapa de vagas ativas"
        description={
          usingFallback
            ? "API indisponivel no momento. Exibindo vagas demonstrativas."
            : "Lista de vagas conectada ao backend Flask."
        }
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {jobsList.map((job) => (
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
        description="Formulario conectado ao `POST /api/v1/jobs` com token JWT."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {companies.length ? (
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              placeholder="ID da empresa"
              className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
            />
          )}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titulo"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Departamento"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Localizacao"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="salary_min"
            value={form.salary_min}
            onChange={handleChange}
            placeholder="Salario minimo"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="salary_max"
            value={form.salary_max}
            onChange={handleChange}
            placeholder="Salario maximo"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descricao da vaga"
            className="min-h-40 rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss md:col-span-2"
          />

          {feedback.error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
              {feedback.error}
            </div>
          ) : null}

          {feedback.success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">
              {feedback.success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-moss md:col-span-2"
          >
            {isSubmitting ? "Salvando vaga..." : "Criar vaga"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
