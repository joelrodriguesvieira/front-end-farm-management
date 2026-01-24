import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  birthDate?: string;
  rg?: string;
  cpfCnpj?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SensorData {
  id?: string;
  temperature: number;
  humidity: number;
  luminosity?: number;
  rationWeight?: number;
  waterLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Device {
  id: string | number;
  name: string;
  type: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Action {
  id: string;
  userId: string;
  system: string;
  action: string;
  quantity: number;
  user?: { name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface Config {
  id?: number;
  mode: "auto" | "manual";
  lighting?: { enabled: boolean; schedule?: { on: string; off: string } };
  fan?: { enabled: boolean; temperature?: { on: number; off: number } };
  feeder?: { enabled: boolean; weight?: { min: number; max: number } };
  waterPump?: { enabled: boolean };
  createdAt?: string;
  updatedAt?: string;
}

// Auth Services
export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(userData: Partial<User> & { password: string }) {
    const { data } = await api.post<User>("/auth/register", userData);
    return data;
  },

  async me() {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

// Sensors Services
export const sensorsService = {
  async getCurrent() {
    const { data } = await api.get<SensorData>("/sensors", {
      params: { limit: 1 },
    });
    return data;
  },

  async getHistory(limit: number = 10, skip: number = 0) {
    const { data } = await api.get<SensorData[]>("/sensors", {
      params: { limit, skip },
    });
    return data;
  },

  async createReading(sensorData: SensorData) {
    const { data } = await api.post<SensorData>("/sensors", sensorData);
    return data;
  },
};

// Devices Services
export const devicesService = {
  async listAll() {
    const { data } = await api.get<Device[]>("/devices");
    return data;
  },

  async getById(id: string | number) {
    const { data } = await api.get<Device>(`/devices/${id}`);
    return data;
  },

  async create(device: Omit<Device, "id">) {
    const { data } = await api.post<Device>("/devices", device);
    return data;
  },

  async update(id: string | number, device: Partial<Device>) {
    const { data } = await api.patch<Device>(`/devices/${id}`, device);
    return data;
  },

  async delete(id: string | number) {
    const { data } = await api.delete(`/devices/${id}`);
    return data;
  },
};

// Actions Services
export const actionsService = {
  async listAll(system?: string, limit: number = 10, skip: number = 0) {
    const { data } = await api.get<Action[]>("/actions", {
      params: { system, limit, skip },
    });
    return data;
  },

  async create(action: Omit<Action, "id" | "createdAt" | "updatedAt">) {
    const { data } = await api.post<Action>("/actions", action);
    return data;
  },
};

// Config Services
export const configService = {
  async get() {
    const { data } = await api.get<Config>("/config");
    return data;
  },

  async update(config: Partial<Config>) {
    const { data } = await api.put<Config>("/config", config);
    return data;
  },
};