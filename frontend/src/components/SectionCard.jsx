export default function SectionCard({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`glass-panel rounded-[28px] border border-white/80 p-6 shadow-soft ${className}`}>
      <div className="mb-5">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-moss/70">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        {description ? <p className="mt-2 text-sm text-ink/65">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
