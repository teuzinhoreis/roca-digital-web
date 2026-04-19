import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type User = {
  id: string;
  nome: string;
  login: string;
  role: 'dono' | 'meeiro';
  cota_percentual: number;
  ativo: number;
};

export type Lote = {
  id: string;
  nome: string;
  tipo: 'seringueira' | 'cacau';
  total_pes: number;
  arvores_problemas: number;
  obs_problemas: string | null;
  user_id: string;
  deleted: number;
};

export type Producao = {
  id: string;
  lote_id: string;
  lote_nome?: string;
  lote_tipo?: string;
  user_id: string;
  user_nome?: string;
  data: string;
  quantidade_kg: number;
  hora: string | null;
  clima: string | null;
  arvores: number | null;
  observacoes: string | null;
  deleted: number;
};

export type Venda = {
  id: string;
  lote_id: string;
  lote_nome?: string;
  user_id: string;
  user_nome?: string;
  data: string;
  quantidade_kg: number;
  preco_kg: number;
  valor_total: number;
  comprador: string | null;
  deleted: number;
};

export type Ocorrencia = {
  id: string;
  lote_id: string | null;
  lote_nome?: string;
  user_id: string;
  user_nome?: string;
  tipo: string;
  descricao: string;
  data: string;
  status: 'aberta' | 'resolvida';
  foto_uri: string | null;
  deleted: number;
};

export type Aplicacao = {
  id: string;
  user_id: string;
  lote_id: string | null;
  lote_nome?: string;
  nome: string;
  produto: string | null;
  data_aplicacao: string;
  dias_intervalo: number | null;
  recorrente: number;
  observacoes: string | null;
};

export type Acerto = {
  id: string;
  meeiro_id: string;
  meeiro_nome?: string;
  ano: number;
  mes: number;
  valor_cota: number;
  valor_vendas: number;
  pago: number;
  data_pagamento: string | null;
};
