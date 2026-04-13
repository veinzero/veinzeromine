interface MetricCardProps {
  label: string;
  value: string;
  note: string;
}

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <div className="panel p-6">
      <div className="eyebrow">{label}</div>
      <div className="mt-4 font-display text-4xl uppercase tracking-[0.18em] text-fog">{value}</div>
      <p className="mt-3 text-sm text-fog/65">{note}</p>
    </div>
  );
}
