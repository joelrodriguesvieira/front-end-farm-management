import { useState } from 'react';
import { devicesService, Device } from '@/src/lib/api';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await devicesService.listAll();
      setDevices(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dispositivos:', err);
      setError('Erro ao carregar dispositivos');
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string | number) => {
    try {
      setLoading(true);
      const device = await devicesService.getById(id);
      setError(null);
      return device;
    } catch (err) {
      console.error('Erro ao buscar dispositivo:', err);
      setError('Erro ao carregar dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (device: Omit<Device, 'id'>) => {
    try {
      setLoading(true);
      const newDevice = await devicesService.create(device);
      setDevices([...devices, newDevice]);
      setError(null);
      return newDevice;
    } catch (err) {
      console.error('Erro ao criar dispositivo:', err);
      setError('Erro ao criar dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string | number, device: Partial<Device>) => {
    try {
      setLoading(true);
      const updated = await devicesService.update(id, device);
      setDevices(devices.map(d => d.id === id ? updated : d));
      setError(null);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar dispositivo:', err);
      setError('Erro ao atualizar dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | number) => {
    try {
      setLoading(true);
      await devicesService.delete(id);
      setDevices(devices.filter(d => d.id !== id));
      setError(null);
    } catch (err) {
      console.error('Erro ao deletar dispositivo:', err);
      setError('Erro ao deletar dispositivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    devices,
    loading,
    error,
    fetchAll,
    getById,
    create,
    update,
    remove,
  };
}
