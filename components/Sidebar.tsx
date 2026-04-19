'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Visão Geral', icon: '👑' },
  { href: '/meeiros', label: 'Meeiros', icon: '👨‍🌾' },
  { href: '/financeiro', label: 'Financeiro', icon: '💰' },
  { href: '/ocorrencias', label: 'Ocorrências', icon: '🔧' },
  { href: '/calendario', label: 'Calendário', icon: '🗓️' },
  { href: '/acertos', label: 'Acertos', icon: '💵' },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{ background: 'rgba(15,12,8,0.98)', borderRight: '1px solid rgba(201,168,76,0.1)' }}
      className="w-56 min-h-screen flex flex-col shrink-0 hidden md:flex">
      <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="text-xs tracking-widest uppercase mb-1" style={{ color: '#7a6e5a' }}>Roça Digital</div>
        <div className="text-xl font-bold" style={{ color: '#e2bb6a' }}>Painel</div>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {links.map(l => {
          const active = path === l.href;
          return (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? '#e2bb6a' : '#7a6e5a',
                borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
              }}>
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t text-xs" style={{ borderColor: 'rgba(201,168,76,0.1)', color: '#5a5040' }}>
        🌿 v1.0
      </div>
    </aside>
  );
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-50"
      style={{ background: 'rgba(15,12,8,0.98)', borderColor: 'rgba(201,168,76,0.1)' }}>
      {links.map(l => {
        const active = path === l.href;
        return (
          <Link key={l.href} href={l.href}
            className="flex-1 flex flex-col items-center py-2 gap-0.5"
            style={{ color: active ? '#e2bb6a' : '#5a5040' }}>
            <span className="text-lg">{l.icon}</span>
            <span className="text-[9px] uppercase tracking-wider">{l.label.split(' ')[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
