import { useState } from 'react';
import { actionsService, Action } from '@/src/lib/api';

export function useActions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async (system?: string, limit: number = 10, skip: number = 0) => {
    try {
      setLoading(true);
      const data = await actionsService.listAll(system, limit, skip);
      setActions(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar ações:', err);
      setError('Erro ao carregar ações');
    } finally {
      setLoading(false);
    }
  };

  const create = async (action: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newAction = await actionsService.create(action);
      setActions([newAction, ...actions]);
      setError(null);
      return newAction;
    } catch (err) {
      console.error('Erro ao criar ação:', err);
      setError('Erro ao criar ação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    actions,
    loading,
    error,
    fetchAll,
    create,
  };
}
