import { getVendasRecentes, getProducaoRecente } from '@/lib/queries';
import { formatBRL, formatKg, formatDate } from '@/lib/format';
import { Card, CardLabel } from '@/components/Card';

export const revalidate = 60;

export default async function FinanceiroPage() {
  const [vendas, producao] = await Promise.all([
    getVendasRecentes(30),
    getProducaoRecente(30),
  ]);

  const totalVendas = vendas.reduce((s: number, v: any) => s + v.valor_total, 0);
  const totalKg = producao.reduce((s: number, p: any) => s + p.quantidade_kg, 0);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>Últimos 30 registros</div>
        <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Financeiro</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>💰 Total Vendas</div>
          <div className="text-xl font-bold" style={{ color: '#4caf7d' }}>{formatBRL(totalVendas)}</div>
        </Card>
        <Card>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>⚖️ Total Produção</div>
          <div className="text-xl font-bold" style={{ color: '#c8874a' }}>{formatKg(totalKg)}</div>
        </Card>
      </div>

      {/* Vendas */}
      <Card className="mb-4">
        <CardLabel>💰 Vendas Recentes</CardLabel>
        {vendas.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#5a5040' }}>Nenhuma venda registrada.</p>}
        <div className="flex flex-col divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
          {vendas.map((v: any) => (
            <div key={v.id} className="flex items-center gap-3 py-2.5">
              <div className="text-xl">{v.lotes?.tipo === 'cacau' ? '🍫' : '🌳'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#f0e6cc' }}>
                  {v.lotes?.nome ?? '—'}
                </div>
                <div className="text-[11px]" style={{ color: '#7a6e5a' }}>
                  {formatDate(v.data)} · {v.lotes?.users?.nome ?? '—'} · {formatKg(v.quantidade_kg)}
                  {v.comprador ? ` · ${v.comprador}` : ''}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: '#4caf7d' }}>{formatBRL(v.valor_total)}</div>
                <div className="text-[10px]" style={{ color: '#5a5040' }}>{formatBRL(v.preco_kg)}/kg</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Producao */}
      <Card>
        <CardLabel>🩸 Produção Recente</CardLabel>
        {producao.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#5a5040' }}>Nenhuma produção registrada.</p>}
        <div className="flex flex-col divide-y">
          {producao.map((p: any) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <div className="text-xl">{p.lotes?.tipo === 'cacau' ? '🍫' : '🌳'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#f0e6cc' }}>
                  {p.lotes?.nome ?? '—'}
                </div>
                <div className="text-[11px]" style={{ color: '#7a6e5a' }}>
                  {formatDate(p.data)} · {p.lotes?.users?.nome ?? '—'}
                  {p.arvores ? ` · 🌳 ${p.arvores} árv.` : ''}
                </div>
              </div>
              <div className="text-sm font-bold" style={{ color: '#e2bb6a' }}>{formatKg(p.quantidade_kg)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
