import { supabase } from './supabase';

const hoje = new Date();
const anoAtual = hoje.getFullYear();
const mesAtual = hoje.getMonth() + 1;

export async function getMeeiros() {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'meeiro')
    .eq('ativo', 1);
  return data ?? [];
}

export async function getLotes() {
  const { data } = await supabase
    .from('lotes')
    .select('*, users(nome)')
    .eq('deleted', 0);
  return data ?? [];
}

export async function getAdminStats(ano = anoAtual, mes = mesAtual) {
  const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const fim = new Date(ano, mes, 0).toISOString().slice(0, 10);

  const [meeiros, lotes, vendas, producao, ocorrencias, acertos] = await Promise.all([
    supabase.from('users').select('id,nome,cota_percentual').eq('role', 'meeiro').eq('ativo', 1),
    supabase.from('lotes').select('*').eq('deleted', 0),
    supabase.from('vendas').select('*').eq('deleted', 0).gte('data', inicio).lte('data', fim),
    supabase.from('producao').select('*').eq('deleted', 0).gte('data', inicio).lte('data', fim),
    supabase.from('ocorrencias').select('*').eq('deleted', 0).eq('status', 'aberta'),
    supabase.from('acertos').select('*').eq('ano', ano).eq('mes', mes),
  ]);

  const ms = meeiros.data ?? [];
  const ls = lotes.data ?? [];
  const vs = vendas.data ?? [];
  const ps = producao.data ?? [];
  const os = ocorrencias.data ?? [];
  const as_ = acertos.data ?? [];

  const totalKg = ps.reduce((s: number, p: any) => s + (p.quantidade_kg ?? 0), 0);
  const totalReceita = vs.reduce((s: number, v: any) => s + (v.valor_total ?? 0), 0);

  const meeiroStats = ms.map((m: any) => {
    const lotesDoMeeiro = ls.filter((l: any) => l.user_id === m.id);
    const loteIds = lotesDoMeeiro.map((l: any) => l.id);
    const vendasMeeiro = vs.filter((v: any) => loteIds.includes(v.lote_id));
    const prodMeeiro = ps.filter((p: any) => loteIds.includes(p.lote_id));
    const ocsMeeiro = os.filter((o: any) => o.user_id === m.id);
    const receitaMes = vendasMeeiro.reduce((s: number, v: any) => s + (v.valor_total ?? 0), 0);
    const kgMes = prodMeeiro.reduce((s: number, p: any) => s + (p.quantidade_kg ?? 0), 0);
    const percentual = m.cota_percentual ?? 50;
    const valorCota = receitaMes * percentual / 100;
    const acerto = as_.find((a: any) => a.meeiro_id === m.id);
    const arvoresProblemas = lotesDoMeeiro.reduce((s: number, l: any) => s + (l.arvores_problemas ?? 0), 0);

    return {
      id: m.id,
      nome: m.nome,
      cota_percentual: percentual,
      lotes_count: lotesDoMeeiro.length,
      kg_mes: kgMes,
      receita_mes: receitaMes,
      valor_cota: valorCota,
      cota_paga: acerto?.pago === 1,
      acerto_id: acerto?.id ?? null,
      ocorrencias_abertas: ocsMeeiro.length,
      arvores_problemas_total: arvoresProblemas,
    };
  });

  const cotaPendenteTotal = meeiroStats
    .filter((m: any) => !m.cota_paga)
    .reduce((s: number, m: any) => s + m.valor_cota, 0);

  return {
    totalMeeiros: ms.length,
    totalLotes: ls.length,
    kgTotal: totalKg,
    receitaTotal: totalReceita,
    cotaPendenteTotal,
    meeiros: meeiroStats,
  };
}

export async function getVendasRecentes(limit = 20) {
  const { data } = await supabase
    .from('vendas')
    .select('*, lotes(nome, tipo, users(nome))')
    .eq('deleted', 0)
    .order('data', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getProducaoRecente(limit = 20) {
  const { data } = await supabase
    .from('producao')
    .select('*, lotes(nome, tipo, users(nome))')
    .eq('deleted', 0)
    .order('data', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getOcorrenciasAbertas() {
  const { data } = await supabase
    .from('ocorrencias')
    .select('*, lotes(nome), users(nome)')
    .eq('deleted', 0)
    .eq('status', 'aberta')
    .order('data', { ascending: false });
  return data ?? [];
}

export async function getAplicacoes() {
  const { data } = await supabase
    .from('aplicacoes')
    .select('*, lotes(nome), users(nome)')
    .order('data_aplicacao', { ascending: false });
  return data ?? [];
}

export async function getAcertosMes(ano = anoAtual, mes = mesAtual) {
  const { data } = await supabase
    .from('acertos')
    .select('*, users(nome)')
    .eq('ano', ano)
    .eq('mes', mes);
  return data ?? [];
}

export async function marcarAcertoPago(acertoId: string) {
  await supabase
    .from('acertos')
    .update({ pago: 1, data_pagamento: new Date().toISOString().slice(0, 10) })
    .eq('id', acertoId);
}

export async function criarAcerto(meeiroId: string, ano: number, mes: number, valorVendas: number, valorCota: number) {
  const id = crypto.randomUUID();
  await supabase.from('acertos').insert({
    id,
    meeiro_id: meeiroId,
    ano,
    mes,
    valor_vendas: valorVendas,
    valor_cota: valorCota,
    pago: 1,
    data_pagamento: new Date().toISOString().slice(0, 10),
  });
}

export async function resolverOcorrencia(id: string) {
  await supabase.from('ocorrencias').update({ status: 'resolvida' }).eq('id', id);
}

export async function getChartData() {
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    meses.push({ ano: d.getFullYear(), mes: d.getMonth() + 1 });
  }

  const results = await Promise.all(meses.map(async ({ ano, mes }) => {
    const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const fim = new Date(ano, mes, 0).toISOString().slice(0, 10);
    const [prod, vend] = await Promise.all([
      supabase.from('producao').select('quantidade_kg').eq('deleted', 0).gte('data', inicio).lte('data', fim),
      supabase.from('vendas').select('valor_total').eq('deleted', 0).gte('data', inicio).lte('data', fim),
    ]);
    const kg = (prod.data ?? []).reduce((s: number, p: any) => s + p.quantidade_kg, 0);
    const receita = (vend.data ?? []).reduce((s: number, v: any) => s + v.valor_total, 0);
    return { mes: `${String(mes).padStart(2, '0')}/${String(ano).slice(2)}`, kg, receita };
  }));

  return results;
}
