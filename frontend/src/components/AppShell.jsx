import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", to: "/dashboard", hint: "KPIs e atalhos" },
  { label: "Vagas", to: "/jobs", hint: "Publicacao e status" },
  { label: "Candidatos", to: "/candidates", hint: "Ranking e triagem" },
  { label: "Funil", to: "/pipeline", hint: "Kanban de etapas" },
  { label: "Testes", to: "/tests", hint: "Desafios e resultados" },
  { label: "Documentos", to: "/documents", hint: "Pendencias e upload" },
];

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-grain text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="glass-panel rounded-[32px] border border-white/60 p-6 shadow-soft lg:w-[320px]">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-moss/70">Novare RH</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">
                Recrutamento mais leve, rapido e inteligente.
              </h1>
            </div>
            <div className="rounded-full bg-moss px-3 py-2 text-xs font-semibold text-white">
              MVP
            </div>
          </div>

          <nav className="space-y-3">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block rounded-[24px] border p-4 transition",
                    isActive
                      ? "border-moss bg-moss text-white shadow-lg"
                      : "border-white/70 bg-white/70 hover:-translate-y-0.5 hover:border-moss/30 hover:bg-white",
                  ].join(" ")
                }
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-1 text-xs opacity-75">{item.hint}</div>
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-[28px] bg-ink p-5 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Proxima fase</p>
            <p className="mt-3 text-lg font-medium">WhatsApp e IA podem entrar sem refatorar a base.</p>
          </div>
        </aside>

        <main className="flex-1 rounded-[32px] border border-white/60 bg-white/60 p-4 shadow-soft md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
