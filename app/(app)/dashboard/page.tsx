import { getAdminStats, getChartData } from '@/lib/queries';
import { formatBRL, formatKg, mesNome } from '@/lib/format';
import { Card, CardLabel, KpiCard } from '@/components/Card';
import Link from 'next/link';

export const revalidate = 60;

export default async function DashboardPage() {
  const hoje = new Date();
  const [stats, chart] = await Promise.all([
    getAdminStats(),
    getChartData(),
  ]);

  const hora = hoje.getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const mesLabel = hoje.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const maxKg = Math.max(...chart.map(d => d.kg), 1);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>
          {saudacao} 👋
        </div>
        <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Visão Geral</h1>
        <p className="text-sm capitalize mt-1" style={{ color: '#7a6e5a' }}>{mesLabel}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KpiCard label="Meeiros" value={String(stats.totalMeeiros)} sub="Ativos" emoji="👥" />
        <KpiCard label="Total Lotes" value={String(stats.totalLotes)} sub="Em operação" emoji="🌿" />
        <KpiCard label="Kg Mês" value={formatKg(stats.kgTotal)} sub="Todos os meeiros" emoji="⚖️" color="#c8874a" />
        <KpiCard label="Receita Mês" value={formatBRL(stats.receitaTotal)} sub="Total" emoji="💰" color="#4caf7d" />
      </div>

      {/* Cota pendente */}
      {stats.cotaPendenteTotal > 0 && (
        <Link href="/acertos">
          <div className="rounded-xl border p-4 mb-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'rgba(201,168,76,0.07)', borderColor: 'rgba(201,168,76,0.22)' }}>
            <div>
              <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>💰 Cotas a Pagar este Mês</div>
              <div className="text-2xl font-bold" style={{ color: '#e2bb6a' }}>{formatBRL(stats.cotaPendenteTotal)}</div>
            </div>
            <div className="text-sm font-semibold px-4 py-2 rounded-lg"
              style={{ background: '#c9a84c', color: '#0f0c08' }}>
              Acertar →
            </div>
          </div>
        </Link>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Gráfico produção */}
        <Card>
          <CardLabel>📊 Produção — últimos 6 meses</CardLabel>
          <div className="flex items-end gap-2 h-24">
            {chart.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm" style={{
                  height: `${Math.max(4, (d.kg / maxKg) * 80)}px`,
                  background: 'rgba(201,168,76,0.5)',
                }} />
                <div className="text-[9px]" style={{ color: '#5a5040' }}>{d.mes}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Meeiros resumo */}
        <Card>
          <CardLabel>👨‍🌾 Meeiros este Mês</CardLabel>
          <div className="flex flex-col gap-2">
            {stats.meeiros.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: m.kg_mes > 0 ? '#4caf7d' : '#5a5040' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: '#f0e6cc' }}>{m.nome}</div>
                  <div className="text-[10px]" style={{ color: '#7a6e5a' }}>{formatKg(m.kg_mes)} · {formatBRL(m.receita_mes)}</div>
                </div>
                {m.ocorrencias_abertas > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(176,58,46,0.15)', color: '#b03a2e', border: '1px solid rgba(176,58,46,0.3)' }}>
                    🔧 {m.ocorrencias_abertas}
                  </span>
                )}
                <span className="text-[11px] font-semibold" style={{ color: m.cota_paga ? '#4caf7d' : '#e2bb6a' }}>
                  {m.cota_paga ? '✓' : '···'}
                </span>
              </div>
            ))}
            {stats.meeiros.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#5a5040' }}>Nenhum meeiro cadastrado.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
