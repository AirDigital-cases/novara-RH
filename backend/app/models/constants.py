USER_ROLES = {"admin", "recrutador", "gestor"}
JOB_STATUSES = {"open", "paused", "closed"}

CANDIDATE_STAGES = {
    "inscricao_recebida",
    "qualificacao",
    "competencia_tecnica",
    "audio_apresentacao",
    "nova_avaliacao",
    "teste_excel",
    "teste_comportamental",
    "entrevista",
    "aprovado",
    "reprovado",
}

DOCUMENT_TYPES = {
    "resume",
    "rg",
    "cpf",
    "comprovante_residencia",
    "certificado",
    "outros",
}

TEST_TYPES = {
    "excel",
    "comportamental",
    "tecnico",
    "exercicio_pratico",
}

SMART_TAGS = {
    "bom_perfil",
    "faltou_documento",
    "salario_acima",
    "experiencia_compativel",
    "sem_experiencia",
    "chamar_entrevista",
    "em_teste",
    "reprovado",
    "aprovado",
}

INITIAL_QUALIFICATION_QUESTIONS = [
    "Você tem experiência na função?",
    "Qual sua última remuneração?",
    "Qual sua pretensão salarial?",
    "Tem disponibilidade de horário?",
    "Tem conhecimento em Excel?",
    "Pode realizar teste técnico?",
    "Pode enviar um áudio de apresentação?",
]
