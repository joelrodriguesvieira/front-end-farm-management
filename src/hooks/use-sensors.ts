import { useState, useEffect } from 'react';
import { sensorsService, SensorData } from '@/src/lib/api';

interface UseSensorsOptions {
  refreshInterval?: number; // em ms
  autoFetch?: boolean;
}

export function useSensors(options: UseSensorsOptions = {}) {
  const { refreshInterval = 30000, autoFetch = true } = options;

  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historyData, setHistoryData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrent = async () => {
    try {
      setLoading(true);
      const data = await sensorsService.getCurrent();
      setCurrentData(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados atuais de sensores:', err);
      setError('Erro ao carregar dados dos sensores');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (limit: number = 10, skip: number = 0) => {
    try {
      setLoading(true);
      const data = await sensorsService.getHistory(limit, skip);
      setHistoryData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar histórico de sensores:', err);
      setError('Erro ao carregar histórico de sensores');
    } finally {
      setLoading(false);
    }
  };

  const createReading = async (data: SensorData) => {
    try {
      setLoading(true);
      const newReading = await sensorsService.createReading(data);
      setError(null);
      return newReading;
    } catch (err) {
      console.error('Erro ao criar leitura de sensor:', err);
      setError('Erro ao criar leitura');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoFetch) return;

    fetchCurrent();
    const interval = setInterval(fetchCurrent, refreshInterval);

    return () => clearInterval(interval);
  }, [autoFetch, refreshInterval]);

  return {
    currentData,
    historyData,
    loading,
    error,
    fetchCurrent,
    fetchHistory,
    createReading,
  };
}
