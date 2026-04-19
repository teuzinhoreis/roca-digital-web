import { getAplicacoes } from '@/lib/queries';
import { formatDate, getNextDate, daysFromNow } from '@/lib/format';
import { Card, CardLabel } from '@/components/Card';

export const revalidate = 60;

function urgColor(days: number) {
  if (days < 0) return '#b03a2e';
  if (days <= 3) return '#d4834a';
  if (days <= 7) return '#e2bb6a';
  return '#4caf7d';
}

function urgLabel(days: number) {
  if (days < 0) return `${Math.abs(days)}d vencida`;
  if (days === 0) return 'Hoje!';
  return `${days}d`;
}

export default async function CalendarioPage() {
  const aplicacoes = await getAplicacoes();

  const comDias = aplicacoes
    .filter((a: any) => a.recorrente && a.dias_intervalo)
    .map((a: any) => {
      const next = getNextDate(a.data_aplicacao, a.dias_intervalo);
      const days = daysFromNow(next);
      return { ...a, nextDate: next, daysLeft: days };
    })
    .sort((a: any, b: any) => a.daysLeft - b.daysLeft);

  const semRecorrencia = aplicacoes.filter((a: any) => !a.recorrente || !a.dias_intervalo);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#7a6e5a' }}>Agendamentos</div>
        <h1 className="text-3xl font-black" style={{ color: '#f0e6cc' }}>Calendário</h1>
      </div>

      {comDias.length > 0 && (
        <Card className="mb-4">
          <CardLabel>🔁 Aplicações Recorrentes</CardLabel>
          <div className="flex flex-col gap-3">
            {comDias.map((a: any) => {
              const color = urgColor(a.daysLeft);
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: '#211c14', border: `1px solid ${color}22` }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: '#f0e6cc' }}>{a.nome}</div>
                    <div className="text-[11px] flex flex-wrap gap-2 mt-0.5" style={{ color: '#7a6e5a' }}>
                      {a.produto && <span>💊 {a.produto}</span>}
                      {a.lotes?.nome && <span>🌿 {a.lotes.nome}</span>}
                      <span>Última: {formatDate(a.data_aplicacao)}</span>
                      <span>Próxima: {formatDate(a.nextDate.toISOString().slice(0, 10))}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold flex-shrink-0" style={{ color }}>
                    {urgLabel(a.daysLeft)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {semRecorrencia.length > 0 && (
        <Card>
          <CardLabel>📋 Aplicações Avulsas</CardLabel>
          <div className="flex flex-col gap-2">
            {semRecorrencia.map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0"
                style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: '#f0e6cc' }}>{a.nome}</div>
                  <div className="text-[11px]" style={{ color: '#7a6e5a' }}>
                    {formatDate(a.data_aplicacao)}
                    {a.produto && ` · 💊 ${a.produto}`}
                    {a.lotes?.nome && ` · 🌿 ${a.lotes.nome}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {aplicacoes.length === 0 && (
        <Card>
          <p className="text-center py-8" style={{ color: '#5a5040' }}>Nenhuma aplicação cadastrada.</p>
        </Card>
      )}
    </div>
  );
}
