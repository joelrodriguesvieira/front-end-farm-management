import { useState, useEffect } from "react";
import { apiService } from "@/src/lib/api";
import { Sensor, Config, Device, Action } from "@/src/types/api";

// ==================== SENSORS HOOK ====================

export function useSensor(initialData?: Sensor | null) {
  const [sensor, setSensor] = useState<Sensor | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData) return;

    const fetchSensor = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLatestSensor();
        setSensor(data as Sensor);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch sensor"));
        setSensor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSensor();
  }, [initialData]);

  return { sensor, loading, error };
}

export function useSensorHistory(limit: number = 10, initialData?: Sensor[] | null) {
  const [history, setHistory] = useState<Sensor[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSensorHistory(limit);
        setHistory(Array.isArray(data) ? data : [data]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch sensor history"));
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit, initialData]);

  return { history, loading, error };
}

// ==================== CONFIG HOOK ====================

export function useConfig(initialData?: Config | null) {
  const [config, setConfig] = useState<Config | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData) return;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await apiService.getConfig();
        setConfig(data as Config || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch config"));
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [initialData]);

  const updateConfig = async (newData: Partial<Omit<Config, "id" | "createdAt" | "updatedAt">>) => {
    try {
      setLoading(true);
      const updated = await apiService.updateConfig(newData);
      setConfig(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update config");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, updateConfig };
}

// ==================== DEVICES HOOK ====================

export function useDevices(initialData?: Device[] | null) {
  const [devices, setDevices] = useState<Device[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData) return;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDevices();
        setDevices(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch devices"));
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [initialData]);

  const updateDeviceStatus = async (id: number, status: "on" | "off") => {
    try {
      const updated = await apiService.updateDevice(id, { status });
      setDevices((prev) =>
        prev.map((device) => (device.id === id ? updated : device))
      );
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update device");
    }
  };

  return { devices, loading, error, updateDeviceStatus };
}

// ==================== ACTIONS HOOK ====================

export function useActions(initialData?: Action[] | null) {
  const [actions, setActions] = useState<Action[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData) return;

    const fetchActions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getActions();
        setActions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch actions"));
        setActions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [initialData]);

  const createAction = async (
    data: Omit<Action, "id" | "createdAt">
  ) => {
    try {
      const newAction = await apiService.createAction(data);
      setActions((prev) => [newAction, ...prev]);
      return newAction;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create action");
    }
  };

  return { actions, loading, error, createAction };
}

// ==================== POLLING HOOK ====================
// Optional: Use this hook to auto-refresh data at intervals
export function usePolling(callback: () => Promise<void>, interval: number = 5000, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // Call immediately on mount
    callback();

    // Setup interval
    const timerId = setInterval(callback, interval);

    return () => clearInterval(timerId);
  }, [callback, interval, enabled]);
}
