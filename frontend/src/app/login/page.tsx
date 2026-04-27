'use client';

import * as React from 'react';
import api from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Factory } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSlow, setIsSlow] = React.useState(false);
  const [serverReady, setServerReady] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  // Warm-up: pinga o backend assim que a página carrega pra acordar o Render
  React.useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const healthUrl = baseUrl.replace(/\/api\/v1\/?$/, '/health');

    fetch(healthUrl, { method: 'GET', mode: 'cors' })
      .then(() => setServerReady(true))
      .catch(() => {
        // Se falhar, tenta de novo em 3s
        setTimeout(() => {
          fetch(healthUrl, { method: 'GET', mode: 'cors' })
            .then(() => setServerReady(true))
            .catch(() => {}); // silencioso
        }, 3000);
      });
  }, []);

  const validate = (email: string, password: string) => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido.';
    if (!password) errs.password = 'A senha é obrigatória.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const errs = validate(email, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setIsSlow(false);

    // Se demorar mais de 3s, mostra mensagem amigável
    const slowTimer = setTimeout(() => setIsSlow(true), 3000);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      toast.success('Login realizado com sucesso!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar login.');
    } finally {
      clearTimeout(slowTimer);
      setIsLoading(false);
      setIsSlow(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-50 mb-4">
            <Factory className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            MinhaFabrica
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Acesse seu painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@minhafabrica.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          {isSlow && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
              <svg className="h-4 w-4 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Servidor iniciando... isso pode levar alguns segundos na primeira vez.</span>
            </div>
          )}

          {!serverReady && !isLoading && (
            <p className="text-center text-xs text-slate-400">
              ⏳ Conectando ao servidor...
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
