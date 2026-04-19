import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Sidebar, BottomNav } from '@/components/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen">
      <Sidebar nome={session.nome} />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
