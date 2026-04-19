import { getAdminStats } from '@/lib/queries';
import { formatBRL, formatKg } from '@/lib/format';
import { Card, CardLabel } from '@/components/Card';

export const revalidate = 60;

export default async function MeeirosPage() {
  const stats = await getAdminStats();

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>Equipe</div>
        <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Meeiros</h1>
      </div>

      <div className="flex flex-col gap-4">
        {stats.meeiros.map(m => {
          const kgPct = stats.kgTotal > 0 ? Math.round((m.kg_mes / stats.kgTotal) * 100) : 0;
          return (
            <Card key={m.id}>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(201,168,76,0.12)' }}>
                  👨‍🌾
                </div>
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: '#f0e6cc' }}>{m.nome}</div>
                  <div className="text-[11px]" style={{ color: '#7a6e5a' }}>
                    {m.lotes_count} lote{m.lotes_count !== 1 ? 's' : ''} · {m.cota_percentual}% cota
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full"
                  style={{ background: m.kg_mes > 0 ? '#4caf7d' : '#5a5040' }} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-base font-bold" style={{ color: '#e2bb6a' }}>{formatKg(m.kg_mes)}</div>
                  <div className="text-[10px] uppercase" style={{ color: '#7a6e5a' }}>Kg mês</div>
                </div>
                <div className="text-center border-x" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                  <div className="text-base font-bold" style={{ color: '#4caf7d' }}>{formatBRL(m.receita_mes)}</div>
                  <div className="text-[10px] uppercase" style={{ color: '#7a6e5a' }}>Receita</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold" style={{ color: '#f0e6cc' }}>{kgPct}%</div>
                  <div className="text-[10px] uppercase" style={{ color: '#7a6e5a' }}>Do total</div>
                </div>
              </div>

              {/* Barra */}
              <div className="h-1.5 rounded-full mb-3" style={{ background: '#2a2318' }}>
                <div className="h-full rounded-full" style={{ width: `${kgPct}%`, background: 'rgba(201,168,76,0.5)' }} />
              </div>

              {/* Footer */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#7a6e5a' }}>💵 Cota a receber</div>
                  <div className="text-sm font-semibold" style={{ color: m.cota_paga ? '#4caf7d' : '#e2bb6a' }}>
                    {formatBRL(m.valor_cota)} {m.cota_paga ? '✓ Pago' : '· Pendente'}
                  </div>
                </div>
                {m.ocorrencias_abertas > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: 'rgba(176,58,46,0.12)', color: '#b03a2e', border: '1px solid rgba(176,58,46,0.25)' }}>
                    🔧 {m.ocorrencias_abertas} ocorrência{m.ocorrencias_abertas > 1 ? 's' : ''}
                  </span>
                )}
                {m.arvores_problemas_total > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: 'rgba(212,131,74,0.12)', color: '#d4834a', border: '1px solid rgba(181,97,26,0.25)' }}>
                    🤒 {m.arvores_problemas_total} árv.
                  </span>
                )}
              </div>
            </Card>
          );
        })}

        {stats.meeiros.length === 0 && (
          <div className="text-center py-16" style={{ color: '#5a5040' }}>
            Nenhum meeiro cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
