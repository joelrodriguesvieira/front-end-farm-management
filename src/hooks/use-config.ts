import { useState } from 'react';
import { configService, Config } from '@/src/lib/api';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await configService.get();
      setConfig(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const update = async (newConfig: Partial<Config>) => {
    try {
      setLoading(true);
      const updated = await configService.update(newConfig);
      setConfig(updated);
      setError(null);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      setError('Erro ao atualizar configurações');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    error,
    fetch,
    update,
  };
}
