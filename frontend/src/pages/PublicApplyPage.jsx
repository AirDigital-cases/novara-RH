import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { getPublicJobById, getPublicJobs, submitCandidateAnswers, submitJobApplication } from "../services/api";

const fallbackJob = {
  id: null,
  title: "Analista de RH",
  company: { name: "Grupo Aurora" },
  description:
    "Nao foi possivel carregar a vaga real agora. O formulario segue disponivel em modo demonstracao.",
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  last_salary: "",
  desired_salary: "",
  resume: null,
  audio_pitch: null,
};

const initialQualificationAnswers = {
  has_experience: "",
  experience_summary: "",
  excel_knowledge: "",
  excel_level: "",
  immediate_start: "",
  saturday_work: "",
  why_this_job: "",
  important_notes: "",
};

const qualificationQuestions = [
  {
    field: "has_experience",
    question: "Você tem experiência na função?",
    type: "select",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    field: "experience_summary",
    question: "Conte brevemente sua experiência.",
    type: "textarea",
    placeholder: "Resuma sua vivência profissional e atividades principais.",
  },
  {
    field: "excel_knowledge",
    question: "Você tem conhecimento em Excel?",
    type: "select",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    field: "excel_level",
    question: "Qual seu nível de Excel?",
    type: "select",
    options: [
      { value: "basico", label: "Básico" },
      { value: "intermediario", label: "Intermediário" },
      { value: "avancado", label: "Avançado" },
    ],
  },
  {
    field: "immediate_start",
    question: "Tem disponibilidade para início imediato?",
    type: "select",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    field: "saturday_work",
    question: "Pode trabalhar aos sábados?",
    type: "select",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    field: "why_this_job",
    question: "Por que você quer essa vaga?",
    type: "textarea",
    placeholder: "Conte o que te atrai nessa oportunidade.",
  },
  {
    field: "important_notes",
    question: "Tem alguma observação importante?",
    type: "textarea",
    placeholder: "Compartilhe informações adicionais que julgar relevantes.",
  },
];

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function isNumericIdentifier(value) {
  return /^\d+$/.test(value || "");
}

function resolveQueryIdentifier(params, searchParams) {
  return (
    params.identifier ||
    searchParams.get("jobId") ||
    searchParams.get("id") ||
    searchParams.get("slug") ||
    ""
  );
}

function buildFormData(form) {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    formData.append(key, value);
  });

  return formData;
}

function buildAnswersPayload(answersForm) {
  const fieldQuestionMap = {
    has_experience: "Você tem experiência na função?",
    experience_summary: "Conte brevemente sua experiência.",
    excel_knowledge: "Você tem conhecimento em Excel?",
    excel_level: "Qual seu nível de Excel?",
    immediate_start: "Tem disponibilidade para início imediato?",
    saturday_work: "Pode trabalhar aos sábados?",
    why_this_job: "Por que você quer essa vaga?",
    important_notes: "Tem alguma observação importante?",
  };

  return Object.entries(fieldQuestionMap)
    .map(([field, question]) => ({
      question,
      answer: (answersForm[field] || "").trim(),
    }))
    .filter((item) => item.answer);
}

export default function PublicApplyPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const identifier = resolveQueryIdentifier(params, searchParams);
  const [job, setJob] = useState(fallbackJob);
  const [resolvedJobId, setResolvedJobId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [qualificationAnswers, setQualificationAnswers] = useState(initialQualificationAnswers);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitState, setSubmitState] = useState({ error: "", success: "", warning: "" });
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      setIsLoadingJob(true);
      setLoadError("");

      try {
        let jobPayload = null;

        if (isNumericIdentifier(identifier)) {
          const response = await getPublicJobById(Number(identifier));
          jobPayload = response.job;
        } else if (identifier) {
          const response = await getPublicJobs({ slug: identifier });
          jobPayload = response.items?.[0] || null;
        } else {
          const response = await getPublicJobs({ status: "open" });
          jobPayload = response.items?.[0] || null;
        }

        if (!isMounted) {
          return;
        }

        if (!jobPayload) {
          setJob(fallbackJob);
          setResolvedJobId(null);
          setUsingFallback(true);
          setLoadError("Nao encontramos a vaga solicitada. Exibindo o formulario em modo demonstracao.");
        } else {
          setJob(jobPayload);
          setResolvedJobId(jobPayload.id);
          setUsingFallback(false);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setJob(fallbackJob);
        setResolvedJobId(null);
        setUsingFallback(true);
        setLoadError(error.message || "Nao foi possivel carregar a vaga agora.");
      } finally {
        if (isMounted) {
          setIsLoadingJob(false);
        }
      }
    }

    loadJob();

    return () => {
      isMounted = false;
    };
  }, [identifier]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleQualificationChange(event) {
    const { name, value } = event.target;
    setQualificationAnswers((current) => ({ ...current, [name]: value }));
  }

  function handleFileChange(event) {
    const { name, files } = event.target;
    setForm((current) => ({ ...current, [name]: files?.[0] || null }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ error: "", success: "", warning: "" });

    if (!resolvedJobId) {
      setSubmitState({
        error: "Nao foi possivel identificar a vaga para esta candidatura.",
        success: "",
        warning: "",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitJobApplication(resolvedJobId, buildFormData(form));
      const candidateId = response.candidate?.id;
      const answersPayload = buildAnswersPayload(qualificationAnswers);

      let successMessage = `Candidatura enviada com sucesso. Score inicial: ${response.candidate.score}.`;
      let warningMessage = "";

      if (candidateId && answersPayload.length) {
        try {
          const answersResponse = await submitCandidateAnswers(candidateId, answersPayload);
          successMessage = `Candidatura enviada com sucesso. ${answersResponse.items.length} respostas complementares salvas.`;
        } catch (error) {
          warningMessage =
            error.message ||
            "A candidatura foi criada, mas nao foi possivel salvar todas as respostas complementares.";
        }
      }

      setSubmitState({
        error: "",
        success: successMessage,
        warning: warningMessage,
      });
      setForm(initialForm);
      setQualificationAnswers(initialQualificationAnswers);
      setFileInputKey((current) => current + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || "Nao foi possivel enviar a candidatura agora.",
        success: "",
        warning: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const salaryRange =
    job?.salary_min || job?.salary_max
      ? [formatCurrency(job.salary_min), formatCurrency(job.salary_max)].filter(Boolean).join(" - ")
      : null;

  return (
    <div className="min-h-screen bg-grain px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-white/80 bg-white/75 p-6 shadow-soft md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss/70">Candidatura publica</p>
        <h1 className="mt-4 text-4xl font-semibold">
          {isLoadingJob ? "Carregando vaga..." : `${job.title} • ${job.company?.name || "Empresa nao informada"}`}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink/65">
          {job.description ||
            "Formulario conectado ao endpoint real de candidatura, com upload de curriculo e audio."}
        </p>

        {salaryRange ? (
          <div className="mt-5 rounded-[24px] bg-sand/55 px-4 py-3 text-sm text-ink/65">
            Faixa estimada da vaga: {salaryRange}
          </div>
        ) : null}

        {loadError ? (
          <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {loadError}
          </div>
        ) : null}

        {submitState.success ? (
          <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {submitState.success}
          </div>
        ) : null}

        {submitState.error ? (
          <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitState.error}
          </div>
        ) : null}

        {submitState.warning ? (
          <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {submitState.warning}
          </div>
        ) : null}

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefone"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Cidade"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="last_salary"
            value={form.last_salary}
            onChange={handleChange}
            placeholder="Ultima remuneracao"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />
          <input
            name="desired_salary"
            value={form.desired_salary}
            onChange={handleChange}
            placeholder="Pretensao salarial"
            className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
          />

          <label className="rounded-2xl border border-dashed border-moss/30 bg-sand/45 px-4 py-5 text-sm text-ink/65">
            Upload do curriculo
            <input
              key={`resume-${fileInputKey}`}
              name="resume"
              type="file"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm"
            />
          </label>

          <label className="rounded-2xl border border-dashed border-clay/30 bg-sand/45 px-4 py-5 text-sm text-ink/65">
            Audio de apresentacao
            <input
              key={`audio-${fileInputKey}`}
              name="audio_pitch"
              type="file"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm"
            />
          </label>

          <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 md:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Perguntas de qualificacao</h2>
              <p className="mt-2 text-sm text-ink/60">
                Essas respostas sao salvas separadamente em `candidate_answers` para enriquecer o perfil.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {qualificationQuestions.map((item) => (
                <label
                  key={item.field}
                  className={item.type === "textarea" ? "block md:col-span-2" : "block"}
                >
                  <span className="mb-2 block text-sm font-medium">{item.question}</span>

                  {item.type === "select" ? (
                    <select
                      name={item.field}
                      value={qualificationAnswers[item.field]}
                      onChange={handleQualificationChange}
                      className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
                    >
                      <option value="">Selecione uma opcao</option>
                      {item.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <textarea
                      name={item.field}
                      value={qualificationAnswers[item.field]}
                      onChange={handleQualificationChange}
                      placeholder={item.placeholder}
                      className="min-h-28 w-full rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingJob || usingFallback}
            className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white md:col-span-2"
          >
            {isSubmitting ? "Enviando candidatura..." : "Enviar candidatura"}
          </button>
        </form>
      </div>
    </div>
  );
}
