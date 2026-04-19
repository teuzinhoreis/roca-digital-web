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
  const loginCorreto = process.env.DONO_LOGIN;
  if (!senhaCorreta || !loginCorreto) redirect('/login?erro=Servidor+mal+configurado');
  if (login.trim() !== loginCorreto) redirect('/login?erro=Usu%C3%A1rio+incorreto');
  if (senha !== senhaCorreta) redirect('/login?erro=Senha+incorreta');

  const { data, error } = await supabase
    .from('users')
    .select('id, nome')
    .eq('role', 'dono')
    .eq('ativo', true)
    .single();

  if (!data) redirect(`/login?erro=${encodeURIComponent(error?.message ?? 'Dono não encontrado no banco')}`);

  await createSession(data.id, data.nome);
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
