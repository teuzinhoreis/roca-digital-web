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

  const senhaCorreta = process.env.DONO_PASSWORD;
  if (!senhaCorreta) redirect('/login?erro=Servidor+mal+configurado');
  if (senha !== senhaCorreta) redirect('/login?erro=Senha+incorreta');

  const { data, error } = await supabase
    .from('users')
    .select('id, nome, role')
    .eq('login', login.trim())
    .eq('ativo', true)
    .eq('role', 'dono')
    .single();

  if (!data) redirect(`/login?erro=${encodeURIComponent(error?.message ?? 'Usuário não encontrado')}`);
  if (data.role !== 'dono') redirect('/login?erro=Acesso+restrito+ao+propriet%C3%A1rio');

  await createSession(data.id, data.nome);
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
