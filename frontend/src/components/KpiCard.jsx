export default function KpiCard({ label, value, delta, accent = "bg-moss" }) {
  return (
    <article className="mesh-card rounded-[28px] border border-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink/60">{label}</span>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <div className="mt-4 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-ink/60">{delta}</div>
    </article>
  );
}
