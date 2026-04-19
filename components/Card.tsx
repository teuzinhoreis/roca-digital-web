export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}
      style={{ background: '#18140e', borderColor: 'rgba(201,168,76,0.12)' }}>
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-widest font-semibold mb-3"
      style={{ color: '#7a6e5a' }}>
      {children}
    </div>
  );
}

export function KpiCard({ label, value, sub, emoji, color }: {
  label: string; value: string; sub?: string; emoji: string; color?: string;
}) {
  return (
    <Card className="flex-1">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7a6e5a' }}>{label}</span>
        <span className="text-xl">{emoji}</span>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: color ?? '#f0e6cc' }}>{value}</div>
      {sub && <div className="text-[11px]" style={{ color: '#7a6e5a' }}>{sub}</div>}
    </Card>
  );
}

export function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}
