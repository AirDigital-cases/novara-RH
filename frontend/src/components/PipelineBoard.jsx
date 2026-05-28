export default function PipelineBoard({ columns }) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((column) => (
        <div key={column.stage} className="rounded-[24px] border border-white/70 bg-white/75 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{column.label}</h3>
            <span className="rounded-full bg-sand px-2 py-1 text-xs">{column.items.length}</span>
          </div>

          <div className="space-y-3">
            {column.items.length ? (
              column.items.map((item) => (
                <article key={item.id || item.name} className="rounded-[18px] border border-sand bg-sand/65 p-3">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="mt-1 text-xs text-ink/60">{item.job || "Vaga nao informada"}</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>Score {item.score ?? 0}</span>
                    <span>{item.city || "Sem cidade"}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-[18px] bg-sand/45 px-3 py-4 text-xs text-ink/45">
                Nenhum candidato nesta etapa.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
