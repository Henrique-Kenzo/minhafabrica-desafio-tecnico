'use client';

import * as React from 'react';
import api from '@/services/api';
import { Users, Package } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Counters } from '@/types';

export default function DashboardPage() {
  const [data, setData] = React.useState<Counters | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        toast.error('Erro ao carregar dados do dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounters();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2">
          Visão geral do sistema MinhaFabrica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Totais Usuários</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {data?.totalUsers || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Produtos</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {data?.totalProducts || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
