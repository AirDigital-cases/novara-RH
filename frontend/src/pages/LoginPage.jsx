export default function LoginPage() {
  return (
    <div className="min-h-screen bg-grain px-4 py-6 text-ink">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel relative overflow-hidden rounded-[36px] border border-white/70 p-8 shadow-soft lg:p-12">
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-clay/15 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.3em] text-moss/70">Novare RH</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.05]">
            Menos operacao manual, mais contratacoes com contexto.
          </h1>
          <p className="mt-6 max-w-lg text-base text-ink/65">
            Painel pensado para times de RH que precisam triagem rapida, candidatos bem organizados
            e um caminho pronto para IA e WhatsApp.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Triagem", "Score automatico por regras"],
              ["Funil", "Etapas visuais e ranking"],
              ["Documentos", "Upload centralizado e rastreavel"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-white/70 bg-white/65 p-4">
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-2 text-sm text-ink/60">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mesh-card rounded-[36px] border border-white/80 p-8 shadow-soft lg:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-clay/80">Acesso RH</p>
          <h2 className="mt-4 text-3xl font-semibold">Entrar na operacao</h2>
          <form className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email corporativo</span>
              <input
                className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
                placeholder="voce@empresa.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Senha</span>
              <input
                type="password"
                className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 outline-none transition focus:border-moss"
                placeholder="••••••••"
              />
            </label>

            <button
              type="button"
              className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-moss"
            >
              Acessar painel
            </button>
          </form>

          <div className="mt-8 rounded-[28px] bg-white/75 p-5">
            <p className="text-sm text-ink/65">Perfis previstos no MVP</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["admin", "recrutador", "gestor"].map((role) => (
                <span key={role} className="rounded-full bg-sand px-3 py-2 text-xs font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
