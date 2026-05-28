export const metrics = [
  { label: "Vagas abertas", value: "14", delta: "+3 esta semana", accent: "bg-moss" },
  { label: "Candidatos no funil", value: "286", delta: "42 novos hoje", accent: "bg-clay" },
  { label: "Documentos pendentes", value: "19", delta: "7 pedem acao imediata", accent: "bg-amber-500" },
  { label: "Testes em andamento", value: "11", delta: "4 aguardando avaliacao", accent: "bg-sky-500" },
];

export const jobs = [
  {
    id: 1,
    title: "Analista de RH",
    company: "Grupo Aurora",
    department: "People",
    location: "Sao Paulo",
    salary: "R$ 3.500 - R$ 4.500",
    status: "open",
    applicants: 48,
  },
  {
    id: 2,
    title: "Assistente Administrativo",
    company: "Novare RH",
    department: "Backoffice",
    location: "Remoto",
    salary: "R$ 2.200 - R$ 2.800",
    status: "open",
    applicants: 71,
  },
  {
    id: 3,
    title: "Coordenador de DP",
    company: "Metal Prime",
    department: "People Ops",
    location: "Campinas",
    salary: "R$ 6.500 - R$ 8.000",
    status: "paused",
    applicants: 19,
  },
];

export const candidateHighlights = [
  { name: "Juliana Freitas", job: "Analista de RH", score: 92, city: "Osasco", stage: "entrevista" },
  { name: "Rafael Nunes", job: "Assistente Administrativo", score: 88, city: "Guarulhos", stage: "teste_excel" },
  { name: "Tainara Melo", job: "Coordenador de DP", score: 84, city: "Campinas", stage: "competencia_tecnica" },
  { name: "Bruno Costa", job: "Analista de RH", score: 81, city: "Sao Paulo", stage: "qualificacao" },
  { name: "Aline Rocha", job: "Assistente Administrativo", score: 79, city: "Barueri", stage: "inscricao_recebida" },
];

export const pipelineColumns = [
  {
    stage: "inscricao_recebida",
    label: "Inscricao",
    items: [candidateHighlights[4]],
  },
  {
    stage: "qualificacao",
    label: "Qualificacao",
    items: [candidateHighlights[3]],
  },
  {
    stage: "competencia_tecnica",
    label: "Tecnico",
    items: [candidateHighlights[2]],
  },
  {
    stage: "teste_excel",
    label: "Teste Excel",
    items: [candidateHighlights[1]],
  },
  {
    stage: "entrevista",
    label: "Entrevista",
    items: [candidateHighlights[0]],
  },
];

export const candidateProfile = {
  name: "Juliana Freitas",
  email: "juliana.freitas@email.com",
  phone: "(11) 99999-2222",
  city: "Osasco",
  job: "Analista de RH",
  stage: "entrevista",
  score: 92,
  tags: ["bom_perfil", "experiencia_compativel", "chamar_entrevista"],
  answers: [
    ["Você tem experiência na função?", "Sim, 5 anos em recrutamento e admissao."],
    ["Qual sua última remuneração?", "R$ 4.100"],
    ["Tem conhecimento em Excel?", "Sim, nivel intermediario para dashboards e procv."],
  ],
  documents: [
    ["Curriculo", "Recebido"],
    ["CPF", "Recebido"],
    ["Comprovante de residencia", "Pendente"],
  ],
  tests: [
    ["Teste Excel", "83 pontos"],
    ["Teste comportamental", "Aguardando envio"],
  ],
};

export const documentsQueue = [
  { candidate: "Leandro Pires", type: "RG", status: "Pendente", age: "2h" },
  { candidate: "Marina Souza", type: "Curriculo", status: "Recebido", age: "30m" },
  { candidate: "Paula Dias", type: "Certificado", status: "Validar", age: "4h" },
];

export const testsQueue = [
  { title: "Excel Basico", candidate: "Rafael Nunes", status: "Em andamento", due: "Hoje" },
  { title: "Case operacional", candidate: "Tainara Melo", status: "Avaliacao RH", due: "Amanha" },
  { title: "Perfil comportamental", candidate: "Julia Cardoso", status: "Nao iniciado", due: "29/05" },
];
