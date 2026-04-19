export function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatKg(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}t`;
  return `${v.toFixed(1)}kg`;
}

export function formatDate(s: string) {
  return new Date(s + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function mesNome(mes: number) {
  return new Date(2000, mes - 1).toLocaleString('pt-BR', { month: 'long' });
}

export function getNextDate(dataUltima: string, diasIntervalo: number) {
  const d = new Date(dataUltima + 'T00:00:00');
  d.setDate(d.getDate() + diasIntervalo);
  return d;
}

export function daysFromNow(date: Date) {
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  return Math.round((date.getTime() - hoje.getTime()) / 86400000);
}
