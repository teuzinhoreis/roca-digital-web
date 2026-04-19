import { loginAction } from '@/app/actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0f0c08' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-2xl font-black" style={{ color: '#f0e6cc' }}>Roça Digital</h1>
          <p className="text-sm mt-1" style={{ color: '#7a6e5a' }}>Painel do Proprietário</p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(176,58,46,0.12)', color: '#e07060', border: '1px solid rgba(176,58,46,0.25)' }}>
            ⚠️ {decodeURIComponent(erro)}
          </div>
        )}

        {/* Form */}
        <form action={loginAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: '#7a6e5a' }}>
              Usuário
            </label>
            <input
              name="login"
              type="text"
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#18140e', border: '1px solid rgba(201,168,76,0.2)', color: '#f0e6cc' }}
              placeholder="seu login"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: '#7a6e5a' }}>
              Senha
            </label>
            <input
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#18140e', border: '1px solid rgba(201,168,76,0.2)', color: '#f0e6cc' }}
              placeholder="••••••••"
            />
          </div>

          <button type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm mt-2 hover:opacity-90 transition-opacity"
            style={{ background: '#c9a84c', color: '#0f0c08' }}>
            Entrar
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#3a3025' }}>
          Acesso restrito ao proprietário
        </p>
      </div>
    </div>
  );
}
