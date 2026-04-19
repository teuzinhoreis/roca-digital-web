'use client';
import { useEffect, useState } from 'react';
import { getAdminStats, marcarAcertoPago, criarAcerto } from '@/lib/queries';
import { formatBRL, mesNome } from '@/lib/format';
import { Card, CardLabel } from '@/components/Card';

export default function AcertosPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const s = await getAdminStats(ano, mes);
    setStats(s);
    setLoading(false);
  }

  useEffect(() => { load(); }, [ano, mes]);

  function navMes(dir: number) {
    let nm = mes + dir;
    let na = ano;
    if (nm < 1) { nm = 12; na--; }
    if (nm > 12) { nm = 1; na++; }
    setMes(nm); setAno(na);
  }

  async function handleAcertar(m: any) {
    setSaving(m.id);
    if (m.acerto_id) {
      await marcarAcertoPago(m.acerto_id);
    } else {
      await criarAcerto(m.id, ano, mes, m.receita_mes, m.valor_cota);
    }
    await load();
    setSaving(null);
  }

  const isFuturo = ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes > hoje.getMonth() + 1);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>Pagamentos</div>
        <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Acertos de Cota</h1>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navMes(-1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ background: '#18140e', border: '1px solid rgba(201,168,76,0.15)', color: '#e2bb6a' }}>
          ‹
        </button>
        <div className="flex-1 text-center">
          <div className="font-semibold capitalize" style={{ color: '#f0e6cc' }}>{mesNome(mes)} {ano}</div>
        </div>
        <button onClick={() => navMes(1)} disabled={isFuturo}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg disabled:opacity-30"
          style={{ background: '#18140e', border: '1px solid rgba(201,168,76,0.15)', color: '#e2bb6a' }}>
          ›
        </button>
      </div>

      {loading && <div className="text-center py-16" style={{ color: '#5a5040' }}>Carregando...</div>}

      {!loading && stats && (
        <>
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card>
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>💰 Total Cotas</div>
              <div className="text-xl font-bold" style={{ color: '#e2bb6a' }}>
                {formatBRL(stats.meeiros.reduce((s: number, m: any) => s + m.valor_cota, 0))}
              </div>
            </Card>
            <Card>
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>⏳ Pendente</div>
              <div className="text-xl font-bold" style={{ color: stats.cotaPendenteTotal > 0 ? '#b03a2e' : '#4caf7d' }}>
                {formatBRL(stats.cotaPendenteTotal)}
              </div>
            </Card>
          </div>

          {/* Cards por meeiro */}
          <div className="flex flex-col gap-3">
            {stats.meeiros.map((m: any) => (
              <Card key={m.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.12)' }}>
                    👨‍🌾
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#f0e6cc' }}>{m.nome}</div>
                    <div className="text-[11px]" style={{ color: '#7a6e5a' }}>{m.cota_percentual}% cota</div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={m.cota_paga
                      ? { background: 'rgba(76,175,125,0.15)', color: '#4caf7d', border: '1px solid rgba(76,175,125,0.3)' }
                      : { background: 'rgba(226,187,106,0.1)', color: '#e2bb6a', border: '1px solid rgba(226,187,106,0.25)' }}>
                    {m.cota_paga ? '✓ Pago' : 'Pendente'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg mb-3"
                  style={{ background: '#211c14' }}>
                  <div className="text-center">
                    <div className="text-xs font-bold" style={{ color: '#4caf7d' }}>{formatBRL(m.receita_mes)}</div>
                    <div className="text-[9px] uppercase mt-0.5" style={{ color: '#5a5040' }}>Vendas</div>
                  </div>
                  <div className="text-center border-x" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                    <div className="text-xs" style={{ color: '#7a6e5a' }}>{m.cota_percentual}%</div>
                    <div className="text-[9px] uppercase mt-0.5" style={{ color: '#5a5040' }}>Percentual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold" style={{ color: '#e2bb6a' }}>{formatBRL(m.valor_cota)}</div>
                    <div className="text-[9px] uppercase mt-0.5" style={{ color: '#5a5040' }}>A Receber</div>
                  </div>
                </div>

                {!m.cota_paga && m.valor_cota > 0 && (
                  <button
                    onClick={() => handleAcertar(m)}
                    disabled={saving === m.id}
                    className="w-full py-2 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
                    style={{ background: '#c9a84c', color: '#0f0c08' }}>
                    {saving === m.id ? 'Salvando...' : `✓ Marcar ${formatBRL(m.valor_cota)} como Pago`}
                  </button>
                )}
                {m.valor_cota === 0 && (
                  <p className="text-center text-xs" style={{ color: '#5a5040' }}>Sem vendas neste mês.</p>
                )}
              </Card>
            ))}

            {stats.meeiros.length === 0 && (
              <Card>
                <p className="text-center py-8" style={{ color: '#5a5040' }}>Nenhum meeiro cadastrado.</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
