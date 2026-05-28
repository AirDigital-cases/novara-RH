import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../components/SectionCard";
import { candidateProfile } from "../lib/mockData";
import { buildUploadUrl, getCandidateById } from "../services/api";

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "Nao informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function formatDate(value) {
  if (!value) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function prettifyStatus(value) {
  return value ? value.replaceAll("_", " ") : "Nao informado";
}

function buildFallbackProfile() {
  return {
    name: candidateProfile.name,
    email: candidateProfile.email,
    phone: candidateProfile.phone,
    city: candidateProfile.city,
    job: candidateProfile.job,
    stage: candidateProfile.stage,
    score: candidateProfile.score,
    lastSalary: null,
    desiredSalary: null,
    createdAt: null,
    resumePath: null,
    audioPitchPath: null,
    tags: candidateProfile.tags || [],
    answers: (candidateProfile.answers || []).map(([question, answer], index) => ({
      id: `fallback-answer-${index + 1}`,
      question,
      answer,
    })),
    documents: (candidateProfile.documents || []).map(([name, status], index) => ({
      id: `fallback-document-${index + 1}`,
      name,
      status,
      filePath: null,
    })),
    tests: (candidateProfile.tests || []).map(([name, status], index) => ({
      id: `fallback-test-${index + 1}`,
      name,
      status,
      result: "",
      type: "mock",
      filePath: null,
    })),
  };
}

function mapCandidateProfile(candidate) {
  return {
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone || "Nao informado",
    city: candidate.city || "Nao informado",
    job: candidate.job?.title || "Vaga nao informada",
    stage: candidate.status,
    score: candidate.score ?? 0,
    lastSalary: candidate.last_salary,
    desiredSalary: candidate.desired_salary,
    createdAt: candidate.created_at,
    resumePath: candidate.resume_path,
    audioPitchPath: candidate.audio_pitch_path,
    tags: (candidate.tags || []).map((item) => item.tag),
    answers: (candidate.answers || []).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
    documents: (candidate.documents || []).map((item) => ({
      id: item.id,
      name: item.document_type,
      status: item.status,
      filePath: item.file_path,
    })),
    tests: (candidate.tests || []).map((item) => ({
      id: item.id,
      name: item.title,
      status: item.status,
      result: item.result,
      type: item.test_type,
      filePath: item.file_path,
    })),
  };
}

function FallbackNotice({ message }) {
  return (
    <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {message}
    </div>
  );
}

export default function CandidateProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(buildFallbackProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCandidate() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getCandidateById(id);

        if (!isMounted) {
          return;
        }

        setProfile(mapCandidateProfile(response.candidate));
        setUsingFallback(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProfile(buildFallbackProfile());
        setUsingFallback(true);
        setErrorMessage(error.message || "Nao foi possivel carregar o candidato agora.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCandidate();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const resumeUrl = buildUploadUrl(profile.resumePath);
  const audioUrl = buildUploadUrl(profile.audioPitchPath);

  return (
    <div className="space-y-6">
      {usingFallback && !isLoading ? (
        <FallbackNotice message={errorMessage || "API indisponivel no momento. Exibindo perfil demonstrativo."} />
      ) : null}

      <SectionCard
        eyebrow="Perfil"
        title={isLoading ? "Carregando candidato..." : profile.name}
        description={`${profile.job} • ${profile.city}`}
      >
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap gap-2">
                {(profile.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-sand px-3 py-2 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
                {!profile.tags?.length ? (
                  <span className="rounded-full bg-sand px-3 py-2 text-xs font-semibold">sem_etiquetas</span>
                ) : null}
              </div>
              <dl className="mt-4 space-y-3 text-sm text-ink/65">
                <div className="flex justify-between gap-3">
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Telefone</dt>
                  <dd>{profile.phone}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cidade</dt>
                  <dd>{profile.city}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Etapa atual</dt>
                  <dd>{prettifyStatus(profile.stage)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Score</dt>
                  <dd>{profile.score}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Ultima remuneracao</dt>
                  <dd>{formatCurrency(profile.lastSalary)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Pretensao salarial</dt>
                  <dd>{formatCurrency(profile.desiredSalary)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cadastrado em</dt>
                  <dd>{formatDate(profile.createdAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Arquivos principais</h3>
              <div className="mt-4 space-y-3 text-sm text-ink/65">
                <div className="rounded-[18px] bg-sand/70 p-4">
                  <div className="text-sm font-semibold">Curriculo</div>
                  <div className="mt-2">
                    {resumeUrl ? (
                      <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-moss underline">
                        Abrir arquivo enviado
                      </a>
                    ) : (
                      "Curriculo ainda nao enviado."
                    )}
                  </div>
                </div>

                <div className="rounded-[18px] bg-sand/70 p-4">
                  <div className="text-sm font-semibold">Audio de apresentacao</div>
                  <div className="mt-2">
                    {audioUrl ? (
                      <audio controls src={audioUrl} className="w-full">
                        Seu navegador nao suporta audio.
                      </audio>
                    ) : (
                      "Audio ainda nao enviado."
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Perguntas de qualificacao</h3>
              <div className="mt-4 space-y-4">
                {(profile.answers || []).map((item, index) => (
                  <div key={item.id || item.question} className="rounded-[18px] bg-sand/70 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      Pergunta {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{item.question}</div>
                    <div className="mt-2 text-sm text-ink/65 whitespace-pre-wrap">{item.answer}</div>
                  </div>
                ))}
                {!profile.answers?.length ? (
                  <div className="rounded-[18px] bg-sand/40 p-4 text-sm text-ink/55">
                    Nenhuma resposta cadastrada.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Documentos</h3>
              <div className="mt-4 space-y-3">
                {(profile.documents || []).map((document) => (
                  <div key={document.id || document.name} className="rounded-[16px] bg-sand/60 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span>{document.name}</span>
                      <span>{document.status}</span>
                    </div>
                    {document.filePath ? (
                      <a
                        href={buildUploadUrl(document.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-xs text-moss underline"
                      >
                        Abrir documento
                      </a>
                    ) : null}
                  </div>
                ))}
                {!profile.documents?.length ? (
                  <div className="rounded-[16px] bg-sand/40 px-4 py-3 text-sm text-ink/55">
                    Nenhum documento anexado.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/80 p-5">
              <h3 className="text-lg font-semibold">Testes</h3>
              <div className="mt-4 space-y-3">
                {(profile.tests || []).map((test) => (
                  <div key={test.id || test.name} className="rounded-[16px] bg-sand/60 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span>{test.name}</span>
                      <span>{test.status}</span>
                    </div>
                    <div className="mt-2 text-xs text-ink/60">
                      {test.type}
                      {test.result ? ` • ${test.result}` : ""}
                    </div>
                    {test.filePath ? (
                      <a
                        href={buildUploadUrl(test.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-xs text-moss underline"
                      >
                        Abrir anexo do teste
                      </a>
                    ) : null}
                  </div>
                ))}
                {!profile.tests?.length ? (
                  <div className="rounded-[16px] bg-sand/40 px-4 py-3 text-sm text-ink/55">
                    Nenhum teste registrado.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
