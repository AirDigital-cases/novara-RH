export default function PublicApplyPage() {
  return (
    <div className="min-h-screen bg-grain px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-white/80 bg-white/75 p-6 shadow-soft md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-moss/70">Candidatura publica</p>
        <h1 className="mt-4 text-4xl font-semibold">Analista de RH • Grupo Aurora</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink/65">
          Formulario inicial preparado para conectar em `POST /api/v1/jobs/:job_id/apply`, incluindo
          upload de curriculo e perguntas de qualificacao.
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2">
          {["Nome completo", "Email", "Telefone", "Cidade", "Ultimo salario", "Pretensao salarial"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                className="rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
              />
            ),
          )}

          <label className="rounded-2xl border border-dashed border-moss/30 bg-sand/45 px-4 py-5 text-sm text-ink/65">
            Upload do curriculo
            <input type="file" className="mt-2 block w-full text-sm" />
          </label>

          <label className="rounded-2xl border border-dashed border-clay/30 bg-sand/45 px-4 py-5 text-sm text-ink/65">
            Audio de apresentacao
            <input type="file" className="mt-2 block w-full text-sm" />
          </label>

          <textarea
            placeholder="Fale um pouco da sua experiencia"
            className="min-h-36 rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss md:col-span-2"
          />
          <button type="button" className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white md:col-span-2">
            Enviar candidatura
          </button>
        </form>
      </div>
    </div>
  );
}
