'use client';
import { useEffect, useState } from 'react';
import { getOcorrenciasAbertas, resolverOcorrencia } from '@/lib/queries';
import { formatDate } from '@/lib/format';
import { Card, CardLabel } from '@/components/Card';

const tipoLabel: Record<string, string> = {
  doenca: '🦠 Doença',
  praga: '🐛 Praga',
  clima: '⛈️ Clima',
  equipamento: '🔧 Equipamento',
  outro: '📋 Outro',
};

export default function OcorrenciasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await getOcorrenciasAbertas();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleResolver(id: string) {
    setResolving(id);
    await resolverOcorrencia(id);
    await load();
    setResolving(null);
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>Em aberto</div>
          <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Ocorrências</h1>
        </div>
        <button onClick={load} className="text-sm px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(201,168,76,0.1)', color: '#e2bb6a', border: '1px solid rgba(201,168,76,0.2)' }}>
          ↻ Atualizar
        </button>
      </div>

      {loading && (
        <div className="text-center py-16" style={{ color: '#5a5040' }}>Carregando...</div>
      )}

      {!loading && items.length === 0 && (
        <Card>
          <p className="text-center py-8" style={{ color: '#5a5040' }}>✅ Nenhuma ocorrência em aberto.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {items.map((oc: any) => (
          <Card key={oc.id}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: '#f0e6cc' }}>
                    {tipoLabel[oc.tipo] ?? oc.tipo}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(176,58,46,0.12)', color: '#b03a2e', border: '1px solid rgba(176,58,46,0.25)' }}>
                    Aberta
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: '#d9c9a8' }}>{oc.descricao}</p>
                <div className="text-[11px] flex flex-wrap gap-2" style={{ color: '#7a6e5a' }}>
                  <span>📅 {formatDate(oc.data)}</span>
                  {oc.lotes?.nome && <span>🌿 {oc.lotes.nome}</span>}
                  {oc.users?.nome && <span>👤 {oc.users.nome}</span>}
                </div>
              </div>
              {oc.foto_uri && (
                <a href={oc.foto_uri} target="_blank" rel="noreferrer"
                  className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border"
                  style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
                  <img src={oc.foto_uri} alt="foto" className="w-full h-full object-cover" />
                </a>
              )}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-end" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <button
                onClick={() => handleResolver(oc.id)}
                disabled={resolving === oc.id}
                className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-50"
                style={{ background: 'rgba(76,175,125,0.15)', color: '#4caf7d', border: '1px solid rgba(76,175,125,0.25)' }}>
                {resolving === oc.id ? 'Salvando...' : '✓ Marcar como Resolvida'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
