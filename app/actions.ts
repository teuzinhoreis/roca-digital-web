'use server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createSession, destroySession } from '@/lib/session';

export async function loginAction(formData: FormData) {
  const login = formData.get('login') as string;
  const senha = formData.get('senha') as string;

  if (!login || !senha) {
    redirect('/login?erro=Preencha+todos+os+campos');
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, nome, role, senha')
    .eq('login', login.trim())
    .eq('ativo', true)
    .single();

  if (!data) redirect(`/login?erro=${encodeURIComponent(error?.message ?? 'nao encontrado')}`);
  if (data.role !== 'dono') redirect('/login?erro=Acesso+restrito+ao+propriet%C3%A1rio');
  if (data.senha !== senha) redirect('/login?erro=Senha+incorreta');

  await createSession(data.id, data.nome);
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
