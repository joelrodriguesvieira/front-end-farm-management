// Sensor Types
export interface Sensor {
  id: number;
  temperature: number;
  humidity: number;
  luminosity: number;
  rationWeight: number;
  waterLevel: boolean;
  createdAt: string;
}

// Device Types
export interface Device {
  id: number;
  name: string;
  type: string;
  status: "on" | "off";
  createdAt: string;
  updatedAt: string;
}

// Config Types
export interface Config {
  id: number;
  mode: "auto" | "manual";
  light: {
    control: string;
    ldrThreshold?: number;
    onTime: string;
    offTime: string;
  };
  temperature: {
    min: number;
    max: number;
  };
  ration: {
    minWeight: number;
    maxWeight: number;
  };
  saveInterval: number;
  createdAt: string;
  updatedAt: string;
}

// Action Types
export interface Action {
  id: number;
  userId: number;
  system: string;
  action: string;
  quantity: number | null;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
}
