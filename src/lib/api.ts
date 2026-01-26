import {
  Sensor,
  Device,
  Config,
  Action,
  ApiError,
} from "@/src/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== SENSORS ====================

  /**
   * Fetch latest sensor reading or history
   * @param limit - Number of records to return (default: 1)
   * @param skip - Number of records to skip (default: 0)
   */
  async getSensors(limit: number = 1, skip: number = 0): Promise<Sensor | Sensor[]> {
    return this.request(`/sensors?limit=${limit}&skip=${skip}`);
  }

  /**
   * Fetch latest sensor reading
   */
  async getLatestSensor(): Promise<Sensor> {
    return this.request("/sensors?limit=1");
  }

  /**
   * Fetch sensor history
   */
  async getSensorHistory(limit: number = 10, skip: number = 0): Promise<Sensor[]> {
    return this.request(`/sensors?limit=${limit}&skip=${skip}`);
  }

  /**
   * Create a new sensor reading
   */
  async createSensor(data: Omit<Sensor, "id" | "createdAt">): Promise<Sensor> {
    return this.request("/sensors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ==================== DEVICES ====================

  /**
   * Fetch all devices
   */
  async getDevices(): Promise<Device[]> {
    return this.request("/devices");
  }

  /**
   * Fetch a specific device by ID
   */
  async getDevice(id: number): Promise<Device> {
    return this.request(`/devices/${id}`);
  }

  /**
   * Create a new device
   */
  async createDevice(
    data: Omit<Device, "id" | "createdAt" | "updatedAt">
  ): Promise<Device> {
    return this.request("/devices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a device
   */
  async updateDevice(
    id: number,
    data: Partial<Omit<Device, "id" | "createdAt" | "updatedAt">>
  ): Promise<Device> {
    return this.request(`/devices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a device
   */
  async deleteDevice(id: number): Promise<{ message: string }> {
    return this.request(`/devices/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== CONFIG ====================

  /**
   * Fetch current configuration
   */
  async getConfig(): Promise<Config | Record<string, never>> {
    return this.request("/config");
  }

  /**
   * Update configuration
   */
  async updateConfig(data: Partial<Omit<Config, "id" | "createdAt" | "updatedAt">>): Promise<Config> {
    return this.request("/config", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ==================== ACTIONS ====================

  /**
   * Fetch all actions
   */
  async getActions(): Promise<Action[]> {
    return this.request("/actions");
  }

  /**
   * Create a new action
   */
  async createAction(
    data: Omit<Action, "id" | "createdAt">
  ): Promise<Action> {
    return this.request("/actions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
